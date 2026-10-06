const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

class UserService {
    //Logica di registrazione: controlli, hashing password e salvataggio
    static async registerUser(userData, details) {
        const rawCF = req.body.CF || req.body.cf;
        const cf = rawCF ? String(rawCF).trim() : '';
        const { name, surname, email, password, role, specializzazione, numeroAlbo, postazione, gruppo_sanguigno, telefono_emergenza } = req.body;

        //Se viene passata la password allora è una registrazione normale, altrimenti ci basta cf, nome e cognome
        const isQuickRegistration = !password;

        if (!cf || !name || !surname) {
            return res.status(400).json({ message: "Inserire i valori nei campi" });
        }

        if (!isQuickRegistration && !email)
            return res.status(400).json({ message: "L'email è obbligatoria" });

        if (email) {
            const existingUser = await user.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: "Utente esistente" });
            }
        }

        const existsUserByCf = await user.findByCf(cf.toUpperCase());
        if (existsUserByCf)
            return res.status(400).json({ message: "Utente associato al codice fiscale inserito" });

        let hashedPassword = null;
        if (password)
            hashedPassword = await bcrypt.hash(password, 10);

        const validRoles = ['paziente', 'medico', 'sportellista', 'admin'];
        let finalRole = 'paziente';

        if (req.user && req.user.role === 'admin') {
            if (role && validRoles.includes(role)) finalRole = role;
        }

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
            postazione: req.body.postazione,
            gruppo_sanguigno: req.body.gruppo_sanguigno,
            telefono_emergenza: req.body.telefono_emergenza
        };

        return await UserModel.create(userData, details);
    }

    //Recupero degli utenti mediante CF con gestione dell'errore se non esiste
    static async getUserByCf(cf) {
        if (!cf) throw new Error("Codice fiscale mancante");
        const user = await UserModel.findByCf(cf);
        if (!user) throw new Error("Utente non trovato");

        return user;
    }

    //Aggiornamento delle informazioni relative all'utente
    static async updateUserData(requester, cf, bodyData) {
        if (!cf) throw new Error("Codice fiscale mancante");

        const isSelf = requester.cf.toUpperCase() === cf.toUpperCase();
        const isAdmin = requester.role === 'admin';

        let isSportellistaOnPatient = false;
        if (requester.role === 'sportellista') {
            const target = await UserModel.findByCf(cf);
            isSportellistaOnPatient = target && target.role === 'paziente';
        }

        if (!isAdmin && !isSelf && !isSportellistaOnPatient) {
            throw new Error("Non autorizzato a modificare questo utente");
        }

        let updateData = { ...bodyData }
        if (bodyData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(bodyData.password, salt);
        }

        const result = await UserModel.updateUser(cf, updateData);
        if (!result || result.updated === 0)
            throw new Error("Nessuna modifica effettuata o utente non trovato");

        return result;
    }

    //Eliminazione utente
    static async deleteUser(requester, cf) {
        if (requester.role !== 'admin') throw new Error("Non hai i persmessi per eliminare l'utente");

        if (!cf) throw new Error("Codice fiscale mancante");

        const result = await UserModel.deleteUser(cf);
        if (result.deleted === 0) throw new Error("Impossibile eliminare: utente non trovato");

        return result;
    }

    //Recupero di tutti gli utenti
    static async getAllUsers() {
        return await UserModel.getAllUsers();
    }

    static async getAllDoctors() {
        const doctors = await UserModel.getAllDoc();
        if (!doctors || doctors.length === 0) throw new Error("Nessun medico trovato");

        return doctors;
    }

    static async getAllPatients() {
        const patients = await UserModel.getAllPatients();
        if (!patients || patients.length === 0) throw new Error("Nessun paziente trovato");

        return patients;
    }
}

module.exports = UserService;