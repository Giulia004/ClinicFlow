const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

class UserService {
    //Logica di registrazione: controlli, hashing password e salvataggio
    static async registerUser(userData, details = {}, requester = null) {
        const rawCF = userData.CF || userData.cf;
        const cf = rawCF ? String(rawCF).trim() : '';
        const { name, surname, email, password, role, specializzazione, numeroAlbo, postazione, gruppo_sanguigno, telefono_emergenza } = {
            ...userData,
            ...details
        };

        //Se viene passata la password allora è una registrazione normale, altrimenti ci basta cf, nome e cognome
        const isQuickRegistration = !password;

        if (!cf || !name || !surname) {
            throw new Error("Inserire i valori nei campi");
        }

        if (!isQuickRegistration && !email)
            throw new Error("L'email è obbligatoria");

        if (email) {
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                throw new Error("Utente esistente");
            }
        }

        const existsUserByCf = await UserModel.findByCf(cf.toUpperCase());
        if (existsUserByCf)
            throw new Error("Utente associato al codice fiscale inserito");

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const validRoles = ['paziente', 'medico', 'sportellista', 'admin'];
        let finalRole = 'paziente';

        if (requester?.role === 'admin') {
            if (role && validRoles.includes(role)) finalRole = role;
        }

        const newUser = {
            cf: cf.toUpperCase(),
            name,
            surname,
            email,
            password: hashedPassword,
            role: finalRole
        };

        const userDetails = {
            specializzazione: specializzazione,
            numeroAlbo: numeroAlbo,
            postazione: postazione,
            gruppo_sanguigno: gruppo_sanguigno,
            telefono_emergenza: telefono_emergenza
        };

        return await UserModel.create(newUser, userDetails);
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

        const updateData = {
            email: bodyData.email,
            password: bodyData.password
        };
        const target = isSelf ? requester : await UserModel.findByCf(cf);
        if (isAdmin) {
            Object.assign(updateData, {
                name: bodyData.name,
                surname: bodyData.surname,
                gruppo_sanguigno: bodyData.gruppo_sanguigno,
                telefono_emergenza: bodyData.telefono_emergenza,
                specializzazione: bodyData.specializzazione,
                numero_albo: bodyData.numero_albo,
                postazione: bodyData.postazione
            });
        } else if (target?.role === 'paziente' && (isSelf || isSportellistaOnPatient)) {
            updateData.gruppo_sanguigno = bodyData.gruppo_sanguigno;
            updateData.telefono_emergenza = bodyData.telefono_emergenza;
        } else if (isSelf && target?.role === 'medico') {
            updateData.specializzazione = bodyData.specializzazione;
            updateData.numero_albo = bodyData.numero_albo;
        } else if (isSelf && target?.role === 'sportellista') {
            updateData.postazione = bodyData.postazione;
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