const db = require("../db/db");

const APPOINTMENT_STATUS = {
    ACTIVE: "attivo",
    CONFIRMED: "confermato",
    UNSUBSCRIBED: "annullato",
    COMPLETED: "completato"
};

const withTransaction = (action) => new Promise((resolve, reject) => {
    db.serialize(() => {
        db.run("BEGIN IMMEDIATE", (beginError) => {
            if (beginError) return reject(beginError);

            action((error, result) => {
                if (error) {
                    return db.run("ROLLBACK", () => reject(error));
                }

                db.run("COMMIT", (commitError) => {
                    if (commitError) return reject(commitError);
                    resolve(result);
                });
            });
        });
    });
});

const AppModel = {
    //Recupero degli appuntamenti con tutte le info applicando filtri opzionali
    getAllWithDetails: (filterType = null, filterId = null) => {
        return new Promise((resolve, reject) => {
            let query = `
                SELECT 
                    a.id, 
                    a.stato, 
                    a.paziente_id, 
                    a.medico_id, 
                    a.slot_id,
                    a.creato_da,
                    s.date as data, 
                    s.orario_inizio,
                    s.orario_fine,
                    u_pat.name AS patient_name, 
                    u_pat.surname AS patient_surname, 
                    u_pat.email AS patient_email,
                    u_doc.name AS medico_name,
                    u_doc.surname AS medico_surname,
                    m.specializzazione AS medico_specializzazione
                FROM appuntamenti a
                JOIN slot_disponibilita s ON a.slot_id = s.id
                JOIN pazienti p ON a.paziente_id = p.id
                JOIN users u_pat ON p.cf_utente = u_pat.cf
                JOIN medici m ON s.medico_id = m.id
                JOIN users u_doc ON m.cf_utente = u_doc.cf
            `;

            const params = [];

            if (filterType === 'paziente' && filterId) {
                query += ` WHERE a.paziente_id=?`;
                params.push(filterId);
            } else if (filterType === 'medico' && filterId) {
                query += ` WHERE s.medico_id=?`;
                params.push(filterId);
            }

            query += ` ORDER BY s.date ASC, s.orario_inizio ASC`;

            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    //Creazione nuovo appuntamento
    createApp: (data) => {
        return withTransaction((done) => {
            const { paziente_id, medico_id, slot_id, stato, creato_da, data_creazione } = data;

            if (!paziente_id || !medico_id || !slot_id || !stato || !creato_da || !data_creazione)
                return done(new Error("Dati mancanti"));

            const query = "INSERT INTO appuntamenti (paziente_id,medico_id,slot_id,stato,creato_da,data_creazione) VALUES(?,?,?,?,?,?)";
            const params = [
                paziente_id,
                medico_id,
                slot_id,
                stato,
                creato_da,
                data_creazione
            ];

            db.run("UPDATE slot_disponibilita SET disponibile=0 WHERE id=? AND disponibile=1", [slot_id], function (error) {
                if (error) return done(error);
                if (this.changes !== 1) return done(new Error("Slot già occupato o non trovato"));

                db.run(query, params, function (insertError) {
                    if (insertError) return done(insertError);
                    done(null, { id: this.lastID, ...data });
                });
            });
        });
    },
    //Aggiornamento stato appuntamento
    updateStatus: (id, status, allowedCurrentStatuses) => {
        return new Promise((resolve, reject) => {
            const placeholders = allowedCurrentStatuses.map(() => '?').join(',');
            const query = `UPDATE appuntamenti SET stato=? WHERE id=? AND stato IN (${placeholders})`;

            db.run(query, [status, id, ...allowedCurrentStatuses], function (err) {
                if (err) return reject(err);
                if (this.changes === 0) return reject(new Error("Appuntamento non trovato o stato non valido"));
                resolve({ updated: this.changes });
            });
        });
    },
    //Disdetta appuntamento
    unsubscribeApp: (id) => {
        return withTransaction((done) => {
            db.get("SELECT slot_id, stato FROM appuntamenti WHERE id=?", [id], (error, appointment) => {
                if (error) return done(error);
                if (!appointment) return done(new Error("Appuntamento non trovato"));
                if (appointment.stato === APPOINTMENT_STATUS.COMPLETED)
                    return done(new Error("Un appuntamento completato non può essere disdetto"));

                db.run("UPDATE appuntamenti SET stato=? WHERE id=?", [APPOINTMENT_STATUS.UNSUBSCRIBED, id], function (updateError) {
                    if (updateError) return done(updateError);
                    if (this.changes === 0) return done(new Error("Appuntamento non trovato"));

                    if (appointment.stato === APPOINTMENT_STATUS.UNSUBSCRIBED) {
                        return done(null, { updated: this.changes });
                    }

                    db.run("UPDATE slot_disponibilita SET disponibile=1 WHERE id=?", [appointment.slot_id], function (slotError) {
                        if (slotError) return done(slotError);
                        done(null, { updated: 1 });
                    });
                });
            });
        });
    },
    //Conferma appuntamento (check-in)
    confirmApp: (id) => {
        return AppModel.updateStatus(id, APPOINTMENT_STATUS.CONFIRMED, [APPOINTMENT_STATUS.ACTIVE]);
    },
    //Appuntamento completato
    completeApp: (id) => {
        return AppModel.updateStatus(id, APPOINTMENT_STATUS.COMPLETED, [APPOINTMENT_STATUS.ACTIVE, APPOINTMENT_STATUS.CONFIRMED]);
    },
    //Eliminazione appuntamento dal db. Operazione eseguita solo dall'admin
    deleteApp: (id) => {
        return withTransaction((done) => {
            db.get("SELECT slot_id, stato FROM appuntamenti WHERE id=?", [id], (error, appointment) => {
                if (error) return done(error);
                if (!appointment) return done(new Error("Appuntamento non trovato"));

                db.run("DELETE FROM appuntamenti WHERE id=?", [id], function (deleteError) {
                    if (deleteError) return done(deleteError);
                    if (this.changes === 0) return done(new Error("Appuntamento non trovato"));

                    if (appointment.stato === APPOINTMENT_STATUS.UNSUBSCRIBED) {
                        return done(null, { message: "Appuntamento eliminato" });
                    }

                    db.run("UPDATE slot_disponibilita SET disponibile=1 WHERE id=?", [appointment.slot_id], function (slotError) {
                        if (slotError) return done(slotError);
                        done(null, { message: "Appuntamento eliminato, slot liberato" });
                    });
                });
            });
        });
    },

    //Ricerca dell'appuntamento tramite id. Restituisce anche i dati del paziente associato
    getById: (id) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT a.*,u.name,u.surname,u.cf as patient_cf FROM appuntamenti a JOIN pazienti p ON a.paziente_id=p.id JOIN users u ON p.cf_utente=u.cf WHERE a.id=?";

            db.get(query, [id], (err, rows) => {
                if (err) return reject(err);
                else resolve(rows);
            });
        });
    }
};

module.exports = AppModel;