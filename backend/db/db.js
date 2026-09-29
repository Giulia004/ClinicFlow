const sqlite3 = require("sqlite3").verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.log(err.message);
    else {
        console.log("Connected to SQLite DB");
        db.run("PRAGMA foreign_keys=ON"); //Abilita le chiavi esterne
    }
});

//Se non esiste creazione delle tabelle
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        cf TEXT PRIMARY KEY UNIQUE,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        email TEXT UNIQUE,
        password VARCHAR(255),
        role TEXT CHECK(role IN ('paziente','medico','sportellista','admin')) NOT NULL
        )
    `);

    //Tabella Medici
    db.run(`CREATE TABLE IF NOT EXISTS medici(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cf_utente TEXT UNIQUE,
        specializzazione TEXT NOT NULL,
        numero_albo TEXT,
        FOREIGN KEY(cf_utente) REFERENCES users(cf) ON DELETE CASCADE ON UPDATE CASCADE)`
    );

    //Tabella Pazienti
    db.run(`CREATE TABLE IF NOT EXISTS pazienti(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cf_utente TEXT UNIQUE,
        gruppo_sanguigno TEXT,
        telefono_emergenza TEXT,
        FOREIGN KEY (cf_utente) REFERENCES users(cf) ON DELETE CASCADE ON UPDATE CASCADE)`
    );

    //Tabella Sportellista
    db.run(`CREATE TABLE IF NOT EXISTS sportellisti(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cf_utente TEXT UNIQUE,
        postazione TEXT,
        FOREIGN KEY (cf_utente) REFERENCES users(cf) ON DELETE CASCADE ON UPDATE CASCADE)`
    );

    //Tabella Slot_Disponibilità
    db.run(`CREATE TABLE IF NOT EXISTS slot_disponibilita(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medico_id INTEGER,
        date DATE NOT NULL,
        orario_inizio TIME NOT NULL,
        disponibile BOOLEAN DEFAULT 1, 
        orario_fine TIME NOT NULL, 
        UNIQUE("medico_id","date","orario_inizio"),
        FOREIGN KEY (medico_id) REFERENCES medici(id) ON DELETE CASCADE)`
    );

    //Tabella appuntamenti
    db.run(`CREATE TABLE IF NOT EXISTS appuntamenti(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        paziente_id INTEGER,
        medico_id INTEGER,
        slot_id INTEGER,
        stato TEXT CHECK(stato IN('attivo','confermato','completato','annullato')) DEFAULT 'attivo',
        creato_da TEXT,
        modificato_da TEXT,
        data_creazione DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (paziente_id) REFERENCES pazienti(id),
        FOREIGN KEY (medico_id) REFERENCES medici(id),
        FOREIGN KEY (slot_id) REFERENCES slot_disponibilita(id))`
    );

    //Tabella Referti
    db.run(`CREATE TABLE IF NOT EXISTS referti(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        appuntamento_id INTEGER UNIQUE,
        medico_id INTEGER,
        paziente_id INTEGER,
        file_referto TEXT,
        data_creazione DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appuntamento_id) REFERENCES appuntamenti(id),
        FOREIGN KEY (medico_id) REFERENCES medici(id),
        FOREIGN KEY (paziente_id) REFERENCES pazienti(id)
    )`);

    //Tabella Feedback
    db.run(`CREATE TABLE IF NOT EXISTS feedback(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        appuntamento_id INTEGER UNIQUE,
        paziente_id INTEGER,
        medico_id INTEGER,
        voto INTEGER CHECK(voto BETWEEN 1 AND 5),
        commento TEXT,
        data_creazione DATE,
        FOREIGN KEY (appuntamento_id) REFERENCES appuntamenti(id),
        FOREIGN KEY (paziente_id) REFERENCES pazienti(id),
        FOREIGN KEY (medico_id) REFERENCES medici(id))`
    );
});

module.exports = db;