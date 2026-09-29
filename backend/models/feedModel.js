const db = require("../db/db");

const FeedModel = {
    //Aggiunta nuovo feedback
    createFeed: (data) => {
        return new Promise((resolve, reject) => {
            const { appuntamento_id, paziente_id, medico_id, voto, commento, data_creazione } = data;

            if (!appuntamento_id || !paziente_id || !medico_id || voto === undefined)
                return reject(new Error("Dati mancanti"));

            const query = `INSERT INTO feedback (appuntamento_id, paziente_id, medico_id, voto, commento, data_creazione) VALUES (?,?,?,?,?,?)`;

            const params = [
                appuntamento_id,
                paziente_id,
                medico_id,
                voto,
                commento || null,
                data_creazione || new Date().toISOString()
            ];

            db.run(query, params, function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    },
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT 
                f.*,
                u_p.name AS paziente_name, 
                u_p.surname AS paziente_surname,
                u_m.name AS medico_name, 
                u_m.surname AS medico_surname
            FROM feedback f
            LEFT JOIN pazienti p ON f.paziente_id = p.id
            LEFT JOIN users u_p ON p.cf_utente = u_p.cf
            LEFT JOIN medici m ON f.medico_id = m.id
            LEFT JOIN users u_m ON m.cf_utente = u_m.cf
            ORDER BY f.data_creazione DESC, f.id DESC
        `;

            db.all(query, [], (err, rows) => {
                if (err) return reject(err);
                else {
                    console.log(rows);
                    resolve(rows);
                }
            });
        });
    },
    //Ricerca del feedback tramite l'id
    getById: (id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM feedback WHERE id=?`;

            db.get(query, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    //Associazione del feedback all'appuntamento tramite id dell'appuntamento
    getByAppId: (appuntamentoId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM feedback WHERE appuntamento_id=?`;

            db.get(query, [appuntamentoId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    //Ricerca dei feedback tramite voto, ordinati per data di creazione in ordine decrescente
    getByVoto: (value) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM feedback WHERE voto=? ORDER BY data_creazione DESC`;

            db.all(query, [value], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    //Eliminazione feedback. Operazione eseguita solo dall'admin
    deleteFeedback: (id) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM feedback WHERE id=?`;

            db.run(query, [id], function (err) {
                if (err) reject(err);
                else resolve({ updated: this.changes });
            });
        });
    }
};

module.exports = FeedModel;