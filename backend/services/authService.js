const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const db = require('../db/db');

const SECRET = process.env.JWT_SECRET || "GA6aXzEKdt0mRjsIr7r9MeMlq2a8rSqnjJoRSV2X5Dz";

class AuthService {
    //Logica di registrazione
    static async registerUser(bodyData, currentUser) {
        const { cf, name, surname, email, password, role, specializzazione, numeroAlbo, postazione } = bodyData;

        if (!email || !password || !role)
            throw new Error("Inserire i valori nei campi obbligatori");

        const existingUser = await UserModel.findByCf(cf);
        if (existingUser)
            throw new Error("Utente esistente");

        const hashedPassword = await bcrypt.hash(password, 10);
        const finalRole = currentUser && currentUser.role === 'admin' ? (role || 'paziente') : 'paziente';

        const userData = {
            cf: cf.toUpperCase(),
            name,
            surname,
            email,
            password: hashedPassword,
            role: finalRole
        };

        const details = {
            specializzazione,
            numeroAlbo,
            postazione
        };

        return await UserModel.create(userData, details);
    }

    //Logica di login
    static async loginUser(email, password) {
        const userFound = await UserModel.findByEmail(email);
        if (!userFound)
            throw new Error("Credenziali non valide (Utente non trovato)");

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch)
            throw new Error("Password non corretta");

        let profileId = null;
        try {
            let query = "";
            if (userFound.role === 'paziente') {
                query = "SELECT id FROM pazienti WHERE cf_utente = ?";
            } else if (userFound.role === 'medico') {
                query = "SELECT id FROM medici WHERE cf_utente = ?";
            } else if (userFound.role === 'sportellista') {
                query = "SELECT id FROM sportellisti WHERE cf_utente = ?";
            }

            if (query) {
                const row = await new Promise((resolve, reject) => {
                    db.get(query, [userFound.cf], (err, r) => err ? reject(err) : resolve(r));
                });
                if (row) profileId = row.id;
            }
        } catch (e) {
            console.log("Errore durante il recupero del profilo tramite id", e.message);
        }

        const token = jwt.sign({
            id: profileId,
            cf: userFound.cf,
            role: userFound.role
        },
            SECRET,
            { expiresIn: "4h" });
        return {
            token,
            user: {
                id: profileId,
                cf: userFound.cf,
                name: userFound.name,
                surname: userFound.surname,
                email: userFound.email,
                role: userFound.role
            }
        };
    }

    //Recupero informazioni utente
    static async getProfileByCf(cf) {
        if (!cf)
            throw new Error("Token JWT non contiene il CF dell'utente");

        const userProfile = await UserModel.findByCf(cf);
        if (!userProfile)
            throw new Error("Utente non trovato");

        return userProfile;
    }
}

module.exports = AuthService;