const express = require("express");
const router = express.Router();

const appController = require("../controllers/appController");
const { checkRole } = require("../middleware/roleMiddleware");
const verifyToken = require("../middleware/authMiddleware");

const validateId = (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ message: "ID non valido" });
    next();
}

router.use(verifyToken);

//Creazione nuovo appuntamento
router.post("/", checkRole(["paziente", "sportellista"]), appController.createApp);

//Lista di tutti gli appuntamenti presenti
router.get("/", checkRole(["admin", "paziente", "sportellista", "medico"]), appController.getAll);

//Conferma appuntamento
router.put("/:id/confirm", validateId, checkRole(["paziente", "sportellista"]), appController.confirmApp);

//Disdire appuntamento
router.put("/:id/unsubscribe", validateId, checkRole(["paziente", "sportellista"]), appController.unsubApp);

//Completare appuntamento
router.put("/:id/complete", validateId, checkRole(["medico"]), appController.completeApp);

//Eliminazione appuntamento
router.delete("/:id", validateId, checkRole(["admin", "sportellista", "paziente"]), appController.deleteApp);

module.exports = router;