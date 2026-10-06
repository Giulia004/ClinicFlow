const UserService = require('../services/userService');

exports.registerUser = async (req, res) => {
    try {
        const newUser = await UserService.registerUser(req.body, req.body.details);
        return res.status(201).json({ message: "Utente registrato con successo", user: newUser });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const allUsers = await UserService.getAllUsers();
        return res.status(200).json(allUsers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getUserByCf = async (req, res) => {
    try {
      const foundUser=await UserService.getUserByCf(req.params.cf);

        return res.status(200).json(foundUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const result = await UserService.updateUser(req.params.cf, req.body);
        return res.status(200).json({ message: "Dati utente aggiornati con successo", result });
    } catch (err) {
        return res.status(500).json({ message: "Errore durante la modifica dei dati dell'utente" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await UserService.deleteUser(req.params.cf);
        return res.status(200).json({ message: "Operatore eliminato con successo" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getAllDoc = async (req, res) => {
    try {
        const doctors = await UserService.getAllDoctors();

        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPatients = async (req, res) => {
    try {
        const patients = await UserService.getAllPatients();

        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};