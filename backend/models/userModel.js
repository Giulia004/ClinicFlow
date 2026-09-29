const db = require("../db/db");
const bcrypt = require('bcryptjs');

const User = {
    //Creazione di un nuovo utente con i dettagli specifici in base al ruolo
    create: (userData, details) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                const query = 'INSERT INTO users (cf,name,surname, email,password,role) VALUES (?, ?,?,?,?,?)';
                const params = [userData.cf.toUpperCase(), userData.name, userData.surname, userData.email, userData.password, userData.role];

                //Inserimento nuovo user
                db.run(query, params, function (error) {
                    if (error) reject(error);
                    //else resolve({ id: this.lastID, cf, email, name, surname, role });
                });

                let detailsQuery = "";
                let detailsParams = [];

                if (userData.role === 'medico') {
                    detailsQuery = "INSERT INTO medici (cf_utente, specializzazione, numero_albo) VALUES(?,?,?)";
                    detailsParams = [userData.cf.toUpperCase(), details.specializzazione, details.numeroAlbo];
                } else if (userData.role === 'sportellista') {
                    detailsQuery = "INSERT INTO sportellisti (cf_utente,postazione) VALUES(?,?)";
                    detailsParams = [userData.cf.toUpperCase(), details.postazione];
                } else if (userData.role === 'paziente') {
                    detailsQuery = "INSERT INTO pazienti (cf_utente) VALUES(?)";
                    detailsParams = [userData.cf.toUpperCase()];
                }

                //Inserimento dei dettagli
                if (detailsQuery) {
                    db.run(detailsQuery, detailsParams, function (err) {
                        if (err) reject(err);
                        else resolve({ cf: userData.cf, role: userData.role, id: this.lastID });
                    });
                } else resolve({ cf: userData.cf, role: userData.role });
            });
        });
    },
    //Ricerca dell'utente in base all'email
    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users WHERE email=?";
            db.get(query, [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    //Ricerca dell'utente in base al codice fiscale
    findByCf: (cf) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT u.*,m.id AS medico_id, m.specializzazione, m.numero_albo, s.id AS sportellista_id, s.postazione, p.id AS paziente_id, p.gruppo_sanguigno, p.telefono_emergenza FROM users u LEFT JOIN medici m ON u.cf=m.cf_utente LEFT JOIN sportellisti s ON u.cf=s.cf_utente LEFT JOIN pazienti p ON u.cf=p.cf_utente WHERE cf=?";
            db.get(query, [cf.toUpperCase()], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);

                const cleanUser = {
                    cf: row.cf,
                    name: row.name,
                    surname: row.surname,
                    email: row.email,
                    role: row.role,
                    specializzazione: row.specializzazione || null,
                    numeroAlbo: row.numero_albo || null,
                    postazione: row.postazione || null,
                    gruppo_sanguigno: row.gruppo_sanguigno || null,
                    telefono_emergenza: row.telefono_emergenza || null,
                };

                if (row.role === 'medico')
                    cleanUser.details = {
                        id: row.medico_id,
                        specializzazione: row.specializzazione,
                        numeroAlbo: row.numero_albo
                    }
                else if (row.role === 'sportellista') {
                    cleanUser.details = {
                        id: row.sportellista_id,
                        postazione: row.postazione
                    };
                }
                else if (row.role === 'paziente') {
                    cleanUser.details = {
                        id: row.paziente_id,
                        gruppo_sanguigno: row.gruppo_sanguigno,
                        telefono_emergenza: row.telefono_emergenza
                    };
                }

                resolve(cleanUser);
            });
        });
    },
    //Modifica dei dati dell'utente. I dati modificabili sono: email, password, e i vari dettagli specifici in base al ruolo
    updateUser: async (cf, data) => {
        try {
            const fields = [];
            const values = [];

            if (data.email) {
                fields.push("email=?");
                values.push(data.email);
            }

            if (data.password) {
                fields.push("password=?");
                values.push(await bcrypt.hash(data.password, 10));
            }

            if (fields.length > 0) {
                values.push(cf.toUpperCase());
                const query = `UPDATE users SET ${fields.join(", ")} WHERE cf=?`;
                await new Promise((resolve, reject) => {
                    db.run(query, values, function (err) {
                        if (err) reject(err);
                        else resolve({ updated: this.changes });
                    });
                });
            }

            if (data.postazione) {
                const query2 = "UPDATE sportellisti SET postazione=? WHERE cf_utente=?";
                await new Promise((resolve, reject) => {
                    db.run(query2, [data.postazione, cf.toUpperCase()], (err) => {
                        if (err) reject(err);
                        else resolve({ updated: this.changes });
                    });
                });
            }

            const patchFields = [];
            const patchValues = [];
            if (data.gruppo_sanguigno || data.telefono_emergenza) {
                patchFields.push(data.gruppo_sanguigno ? "gruppo_sanguigno=?" : null);
                patchFields.push(data.telefono_emergenza ? "telefono_emergenza=?" : null);
                if (data.gruppo_sanguigno) patchValues.push(data.gruppo_sanguigno);
                if (data.telefono_emergenza) patchValues.push(data.telefono_emergenza);
                patchValues.push(cf.toUpperCase());

                const query3 = `UPDATE pazienti SET ${patchFields.join(", ")} WHERE cf_utente=?`;

                await new Promise((resolve, reject) => {
                    db.run(query3, patchValues, (err) => {
                        if (err) reject(err);
                        else resolve({ updated: this.changes });
                    });
                });
            }

            return { success: true };
        }
        catch (error) {
            throw error;
        }
    },
    //Ricerca di tutti gli utenti presenti nel database
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT u.*,m.*,s.*,p.* FROM users u LEFT JOIN medici m ON u.cf=m.cf_utente LEFT JOIN sportellisti s ON u.cf=s.cf_utente LEFT JOIN pazienti p ON u.cf=p.cf_utente";
            db.all(query, [], (err, row) => {
                if (err) return reject(err);
                else resolve(row);
            });
        });
    },
    //Recupero di tutti i medici nel database con i loro dettagli specifici
    getAllDoc: () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT u.cf,u.name,u.surname,m.id,m.specializzazione FROM users u JOIN medici m ON u.cf=m.cf_utente WHERE u.role='medico'";

            db.all(query, [], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    //Recupero di tutti i pazienti con i relativi dettagli specifici
    getAllPatients: () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT u.name,u.surname,u.email,u.cf,p.id,p.gruppo_sanguigno,p.telefono_emergenza FROM users u JOIN pazienti p ON u.cf=p.cf_utente WHERE u.role='paziente'";

            db.all(query, [], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    //Eliminazione dell'utente tramite codice fiscale. L'operazione può essere eseguita solo dall'admin
    deleteUser: (cf) => {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM users WHERE cf=?";
            db.run(query, [cf.toUpperCase()], function (err) {
                if (err) reject(err);
                else resolve({ deleted: this.changes });
            });
        });
    }
};

module.exports = User;