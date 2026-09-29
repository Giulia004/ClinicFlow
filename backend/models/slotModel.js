const db = require("../db/db")

const SlotModel = {
    //Creazione nuovo slot
    create: (slotData) => {
        return new Promise((resolve, reject) => {
            const { medico_id, date, orario_inizio, disponibile, orario_fine, prenotazione_id } = slotData;

            if (!medico_id || !date || !orario_inizio || !orario_fine)
                return reject(new Error("Dati mancanti"));

            const query = 'INSERT INTO slot_disponibilita (medico_id,date,orario_inizio,disponibile,orario_fine) VALUES(?,?,?,?,?)';

            const params = [
                medico_id,
                date,
                orario_inizio,
                1,
                orario_fine
            ];

            db.run(query, params, function (error) {

                if (error) reject(error);
                else {
                    resolve({
                        id: this.lastID,
                        ...slotData,
                        disponibile: 1
                    });
                }
            });
        });
    },
    getAllSlots: () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT s.*,u.name as medico_name,u.surname as medico_surname,m.specializzazione FROM slot_disponibilita s JOIN medici m ON s.medico_id=m.id JOIN users u ON m.cf_utente=u.cf WHERE s.date>=CURRENT_DATE ORDER BY s.date ASC,s.orario_inizio ASC";
            db.all(query, [], (error, rows) => {
                if (error) reject(error);
                else resolve(rows);
            });
        });
    },
    //Recupero di tutti gli slot associati ai medici
    getAllSlotsWithDoctors: () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT s.*,u.name as medico_name,u.surname as medico_surname,m.specializzazione FROM slot_disponibilita s JOIN medici m ON s.medico_id=m.id JOIN users u ON m.cf_utente=u.cf WHERE s.disponibile=1 AND s.date>=CURRENT_DATE ORDER BY s.date ASC,s.orario_inizio ASC";
            db.all(query, [], (error, rows) => {
                if (error) reject(error);
                else resolve(rows);
            });
        });
    },
    //Filtra gli slot per data e/o medico
    getSlotsByFilter: (medicoId, date) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT s.*, u.name as medico_name,u.surname as medico_surname FROM slot_disponibilita s JOIN medici m ON s.medico_id=m.id JOIN users u ON m.cf_utente=u.cf WHERE 1=1 AND s.disponibile=1 AND s.date>CURRENT_DATE';
            const params = [];

            if (medicoId) {
                query += " AND s.medico_id=?";
                params.push(medicoId);
            }
            if (date) {
                query += " AND s.date=?";
                params.push(date);
            }

            query += " ORDER BY s.orario_inizio ASC";

            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    //Prenotazione slot
    bookSlot: (slotId) => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE slot_disponibilita SET disponibile=0 WHERE id=?";

            db.run(query, [slotId], function (err) {
                if (err) reject(err);
                else if (this.changes === 0) return reject(new Error("Slot già occupato"));
                else resolve({ updated: this.changes });
            });
        });
    },
    //Annulla prenotazione
    releaseSlot: (slotId) => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE slot_disponibilita SET disponibile=1 WHERE id=?";

            db.run(query, [slotId], function (err) {
                if (err) reject(err);
                else resolve({ updated: this.changes });
            });
        });
    },
    //Rimozione slot
    deleteSlot: (slotId) => {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM slot_disponibilita WHERE id=?";
            db.run(query, [slotId], function (err) {
                if (err) reject(err);
                else resolve({ deleted: this.changes });
            });
        });
    },
    //Recupero dello slot tramite l'id
    getById: (slotId) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM slot_disponibilita WHERE id=?";

            db.get(query, [slotId], function (err, rows) {
                if (err) reject(err);
                else resolve(rows);
            })
        })
    },
    //Update slot
    update: (slotId, slotData) => {
        return new Promise((resolve, reject) => {
            const { medico_id, date, orario_inizio, orario_fine } = slotData;
            if (!medico_id || !date || !orario_inizio || !orario_fine) return reject(new Error("Dati mancanti"));

            const query = `UPDATE slot_disponibilita SET medico_id=?, date=?, orario_inizio=?, orario_fine=? WHERE id=?`;

            const params = [medico_id, date, orario_inizio, orario_fine, slotId];

            db.run(query, params, function (err) {
                if (err) reject(err);
                else if (this.changes === 0) reject(new Error("Slot non trovato"));
                else resolve({ updated: this.changes, id: slotId, ...slotData });
            });
        });
    }
};

module.exports = SlotModel;