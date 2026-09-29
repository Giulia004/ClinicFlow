const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/db');
const user = require("../models/userModel");

const SECRET = process.env.JWT_SECRET || "GA6aXzEKdt0mRjsIr7r9MeMlq2a8rSqnjJoRSV2X5Dz";

exports.register = async (req, res) => {
    try {
        const { cf, name, surname, email, password, role, specializzazione, numeroAlbo, postazione } = req.body;

        if (!email || !password || !cf) {
            return res.status(400).json({ message: "Inserire i valori nei campi" });
        }

        const existingUser = await user.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Utente esistente" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const finalRole = req.user && req.user.role === 'admin' ? (role || 'paziente') : 'paziente';

        const userData = {
            cf: cf.toUpperCase(),
            name,
            surname,
            email,
            password: hashedPassword,
            role: finalRole
        };

        const details = {
            specializzazione: req.body.specializzazione,
            numeroAlbo: req.body.numeroAlbo,
            postazione: req.body.postazione
        };

        await user.create(userData, details);
        res.status(201).json({ message: "Utente creato con successo" });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userFound = await user.findByEmail(email);

        if (!userFound)
            return res.status(401).json({ message: "Credenziali non valide (Utente non trovato)" });

        const isMatch = await bcrypt.compare(password, userFound.password);
    
        if (!isMatch)
            return res.status(401).json({ message: "Credenziali non valide (Password errata)" });
        // Recupera l'id numerico associato al profilo (pazienti/medici/sportellisti)
        let profileId = null;
        try {
            if (userFound.role === 'paziente') {
                const row = await new Promise((resolve, reject) => db.get("SELECT id FROM pazienti WHERE cf_utente=?", [userFound.cf], (err, r) => err ? reject(err) : resolve(r)));
                if (row) profileId = row.id;
            } else if (userFound.role === 'medico') {
                const row = await new Promise((resolve, reject) => db.get("SELECT id FROM medici WHERE cf_utente=?", [userFound.cf], (err, r) => err ? reject(err) : resolve(r)));
                if (row) profileId = row.id;
            } else if (userFound.role === 'sportellista') {
                const row = await new Promise((resolve, reject) => db.get("SELECT id FROM sportellisti WHERE cf_utente=?", [userFound.cf], (err, r) => err ? reject(err) : resolve(r)));
                if (row) profileId = row.id;
            }
        } catch (e) {
            console.error('Errore recupero profilo id:', e.message);
        }

        const token = jwt.sign({ id: profileId, cf: userFound.cf, role: userFound.role }, SECRET, {
            expiresIn: "8h"
        });

        return res.json({
            token, user: {
                id: profileId,
                cf: userFound.cf,
                name: userFound.name,
                surname: userFound.surname,
                email: userFound.email,
                role: userFound.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//Recupero del profilo dell'utente loggato tramite il token JWT. Il token contiene il codice fiscale dell'utente, che viene utilizzato per recuperare i dati dal database
exports.getProfile = async (req, res) => {
    try {
        const cf = req.user?.cf;
        if (!cf) {
            return res.status(400).json({ message: "Token JWT non contiene il CF dell'utente" });
        }

        const userProfile = await user.findByCf(cf);
        if (!userProfile) return res.status(404).json({ message: "Utente non trovato" });

        return res.status(200).json(userProfile);
    } catch (error) {
        console.error('Errore getProfile:', error);
        return res.status(500).json({ error: error.message });
    }
}