const user = require("../models/userModel");
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    try {
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

        const newUser = await user.create(userData, details);
        res.status(201).json({ message: "Utente creato con successo", id: newUser.id });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const allUsers = await user.getAllUsers();
        return res.status(200).json(allUsers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getUserByCf = async (req, res) => {
    try {
        const { cf } = req.params;
        if (!cf) return res.status(400).json({ message: "CF non valido" });

        const foundUser = await user.findByCf(cf);
        if (!foundUser) return res.status(404).json({ message: "Utente non trovato" });

        return res.status(200).json(foundUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const requester = req.user;
        const { cf } = req.params;

        const isSelf = requester.cf.toUpperCase() === cf.toUpperCase();
        const isAdmin = requester.role === 'admin';

        let isSportellistaOnPatient = false;
        if (requester.role === 'sportellista') {
            const target = await user.findByCf(cf);
            isSportellistaOnPatient = !!target && target.role === 'paziente';
        }

        if (!isAdmin && !isSelf && !isSportellistaOnPatient) {
            return res.status(403).json({ message: "Non hai i permessi per modificare questo profilo" });
        }

        const result = await user.updateUser(cf, req.body);
        return res.status(200).json({ message: "Dati modificati con successo", updated: result.updated });
    } catch (err) {
        return res.status(500).json({ message: "Errore durante la modifica dei dati dell'utente" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const requester = req.user;
        const { cf } = req.params;

        if (requester.role !== 'admin') {
            return res.status(403).json({ message: "Non hai i permessi per eliminare questo profilo" });
        }
        if (!cf) return res.status(400).json({ message: "CF non valido" });

        const result = await user.deleteUser(cf);

        if (result.deleted === 0)
            return res.status(404).json({ message: "Operatore non trovato" });

        return res.status(200).json({ message: "Operatore eliminato con successo" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getAllDoc = async (req, res) => {
    try {
        const doctors = await user.getAllDoc();

        if (!doctors) return res.status(404).json({ message: "Nessun medico trovato" });

        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPatients = async (req, res) => {
    try {
        const patients = await user.getAllPatients();

        if (!patients) return res.status(404).json({ message: "Nessun paziente trovato" });

        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};