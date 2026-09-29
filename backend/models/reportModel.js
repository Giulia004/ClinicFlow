const db = require("../db/db");

const ReportModel = {
    //Creazione nuovo referto
    createReport: (data) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO referti (appuntamento_id,paziente_id, medico_id,file_referto) VALUES (?,?,?,?)`;

            db.run(query, [data.appuntamento_id, data.paziente_id, data.medico_id, data.file_referto], function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    },
    //Recupero di tutti i referti presenti nel database
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM referti";

            db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    //Recupero del referto mediante l'id
    getById: (id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM referti WHERE id=?`;

            db.get(query, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    //Recupero dei referti scritti da un medico
    getByDocId: (id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM referti WHERE medico_id=? ORDER BY data_creazione DESC`;

            db.all(query, [id], (err, row) => {
                if (err) return reject(err);
                else resolve(row)
            })
        });
    },
    //Recupero dei referti di un paziente
    getByPatientId: (id) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM referti WHERE paziente_id=?";

            db.all(query, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    //Eliminazione referto dal db.
    deleteReport: (id) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM referti WHERE id=?`;

            db.run(query, [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },
    //Recupero del file del referto mediante l'id
    getFileReport: (id) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT file_referto FROM referti WHERE id=?";

            db.get(query, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

module.exports = ReportModel;