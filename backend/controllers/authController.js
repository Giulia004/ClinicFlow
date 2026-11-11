const AuthService = require("../services/authService");

//Registrazione nuovo utente
exports.register = async (req, res) => {
    try {
        const result = await AuthService.registerUser(req.body, req.user);
        res.status(201).json(result);
    } catch (error) {
        const status = error.statusCode || (
            error.code === "SQLITE_CONSTRAINT" ? 409
                : error.code === "SQLITE_BUSY" || error.code === "SQLITE_LOCKED" ? 503
                    : 500
        );
        if (status === 500) console.error("Errore registrazione:", error);
        res.status(status).json({
            message: status === 503
                ? "Database momentaneamente occupato. Riprova tra qualche secondo."
                : status === 500
                    ? "Errore durante la registrazione"
                    : error.message || "Email o codice fiscale già registrati"
        });
    }
};

//Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await AuthService.loginUser(email, password);
        res.status(200).json(result);
    } catch (err) {
        const status = err.message === "Credenziali non valide"
            ? 401
            : err.message === "Email e password obbligatorie"
                ? 400
                : 500;
        if (status === 500) console.error("Errore login:", err);
        res.status(status).json({
            message: status === 500 ? "Errore durante l'accesso" : err.message
        });
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