const db = require("../db/db");

const APPOINTMENT_STATUS = {
    ACTIVE: "attivo",
    CONFIRMED: "confermato",
    UNSUBSCRIBED: "annullato",
    COMPLETED: "completato"
};
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
        return new Promise((resolve, reject) => {
            const { paziente_id, medico_id, slot_id, stato, creato_da, data_creazione } = data;

            if (!paziente_id || !medico_id || !slot_id || !stato || !creato_da || !data_creazione)
                return reject(new Error("Dati mancanti"));

            const query = "INSERT INTO appuntamenti (paziente_id,medico_id,slot_id,stato,creato_da,data_creazione) VALUES(?,?,?,?,?,?)";

            const params = [
                paziente_id,
                medico_id,
                slot_id,
                stato,
                creato_da,
                data_creazione
            ];

            db.serialize(() => {
                db.run(query, params, function (error) {
                    if (error) reject(error);
                    const appointmentId = this.lastID;

                    db.run("UPDATE slot_disponibilita SET disponibile=0 WHERE id=?", [slot_id], function (err) {
                        if (err) return reject(err);

                        resolve({
                            id: appointmentId,
                            ...data
                        });
                    });
                  
                });
            });
        });
    },
    //Aggiornamento stato appuntamento
    updateStatus: (id, status) => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE appuntamenti SET stato=? WHERE id=?";

            db.run(query, [status, id], function (err) {
                if (err) return reject(err);
                if (this.changes === 0) return reject(new Error("Appuntamento non trovato"));
                resolve({ updated: this.changes });
            });
        });
    },
    //Disdetta appuntamento
    unsubscribeApp: (id) => {
        return AppModel.updateStatus(id, APPOINTMENT_STATUS.UNSUBSCRIBED);
    },
    //Conferma appuntamento (check-in)
    confirmApp: (id) => {
        return AppModel.updateStatus(id, APPOINTMENT_STATUS.CONFIRMED);
    },
    //Appuntamento completato
    completeApp: (id) => {
        return AppModel.updateStatus(id, APPOINTMENT_STATUS.COMPLETED);
    },
    //Eliminazione appuntamento dal db. Operazione eseguita solo dall'admin
    deleteApp: (id) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                //Recupero dello slot collegato all'appuntamento
                db.get("SELECT slot_id FROM appuntamenti WHERE id=?", [id], (err, row) => {
                    if (err || !row) return reject(err || new Error("Appuntamento non trovato"));
                    const slotId = row.slot_id;

                    db.run("DELETE FROM appuntamenti WHERE id=?", [id], function (err) {
                        if (err || this.changes === 0) reject(err);

                        //Liberiamo lo slot
                        db.run("UPDATE slot_disponibilita SET disponibile=1 WHERE id=?", [slotId], function (err) {
                            if (err) reject(err);
                            else resolve(({ message: "Appuntamento eliminato, slot liberato" }));
                        });
                    })
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