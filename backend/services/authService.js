const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const db = require('../db/db');

const SECRET = process.env.JWT_SECRET || "GA6aXzEKdt0mRjsIr7r9MeMlq2a8rSqnjJoRSV2X5Dz";

class AuthService {
    //Logica di registrazione
    static async registerUser(bodyData, currentUser) {
        const { cf, name, surname, email, password, role, specializzazione, numeroAlbo, postazione } = bodyData;
        const normalizedCf = typeof cf === "string" ? cf.trim().toUpperCase() : "";
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

        if (!normalizedCf || !name?.trim() || !surname?.trim() || !normalizedEmail || !password || !role) {
            throw Object.assign(new Error("Compila tutti i campi obbligatori"), { statusCode: 400 });
        }

        const existingUser = await UserModel.findByCf(normalizedCf);
        if (existingUser) {
            throw Object.assign(new Error("Codice fiscale già registrato"), { statusCode: 409 });
        }

        const existingEmail = await UserModel.findByEmail(normalizedEmail);
        if (existingEmail) {
            throw Object.assign(new Error("Email già registrata"), { statusCode: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const finalRole = currentUser && currentUser.role === 'admin' ? (role || 'paziente') : 'paziente';

        const userData = {
            cf: normalizedCf,
            name: name.trim(),
            surname: surname.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: finalRole
        };

        const details = {
            specializzazione,
            numeroAlbo,
            postazione
        };

        await UserModel.create(userData, details);
        return this.loginUser(normalizedEmail, password);
    }

    //Logica di login
    static async loginUser(email, password) {
        if (!email?.trim() || !password)
            throw new Error("Email e password obbligatorie");

        const userFound = await UserModel.findByEmail(email.trim());
        if (!userFound)
            throw new Error("Credenziali non valide");

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch)
            throw new Error("Credenziali non valide");

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