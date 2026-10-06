const AuthService = require("../services/authService");

//Registrazione nuovo utente
exports.register = async (req, res) => {
    try {

        await AuthService.registerUser(req.body, req.user);
        res.status(201).json({ message: "Utente creato con successo" });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

//Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await AuthService.loginUser(email, password);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Recupero del profilo dell'utente loggato
exports.getProfile = async (req, res) => {
    try {
        const cf = req.user?.cf;
        const userProfile = await AuthService.getProfileByCf(cf);
        
        return res.status(200).json(userProfile);
    } catch (error) {
        console.error('Errore getProfile:', error);
        return res.status(500).json({ error: error.message });
    }
};