exports.checkRole = (allowedRole) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role)
            return res.status(401).json({ message: "Ruolo mancante" });

        if (!allowedRole.includes(req.user.role))
            return res.status(403).json({ message: "Permessi mancanti" });

        next();
    }
}