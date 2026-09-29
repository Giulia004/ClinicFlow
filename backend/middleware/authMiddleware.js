const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
        return res.status(401).json({ message: "Accesso negato. Token mancante o formato non valido" });
    }

    //Estrazione del token
    const token = authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Accesso negato. Token mancante" });

    try {
        const verified = jwt.verify(token, SECRET); //Verifico il token
        req.user = verified; //Inserisco i dati dell'utente richiesto
        next(); //Passo al prossimo middleware o controller
    } catch (err) {
        console.error("Errore di verifica JWT:", err.message);
        if (err.name == 'TokenExpiredError')
            return res.status(401).json({ message: "Sessione scaduta" });
        return res.status(403).json({ message: "Token non valido o autorizzazione fallita" });
    }
}