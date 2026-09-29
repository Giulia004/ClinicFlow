const express = require("express");
const router = express.Router();

const slotController = require("../controllers/slotController");

const { checkRole } = require("../middleware/roleMiddleware");
const verifyToken = require("../middleware/authMiddleware");

//Lista di tutti gli slot presenti
router.get("/", verifyToken, checkRole(["medico", "admin", "sportellista", "paziente"]), slotController.getAllSlot);

//Dettaglio singolo slot
router.get("/:id", verifyToken, checkRole(["medico", "admin", "sportellista", "paziente"]), slotController.getById);

//Slot disponibili
router.get("/medico/:medicoId", verifyToken, checkRole(["medico", "admin", "sportellista", "paziente"]), slotController.getSlotByFilter);

//Creazione nuovo slot
router.post("/", verifyToken, checkRole(["medico", "admin"]), slotController.createSlot);

//Modifica dei dati di uno slot
router.put("/:id", verifyToken, checkRole(["admin"]), slotController.updateSlot);

//Prenotazione slot
router.put("/:id/book", verifyToken, checkRole(["paziente", "sportellista"]), slotController.bookSlot);

//Disdetta dello slot
router.put("/:id/release", verifyToken, checkRole(["medico", "admin", "sportellista", "paziente"]), slotController.releaseSlot);

//Eliminazione slot
router.delete("/:id", verifyToken, checkRole(["medico", "admin"]), slotController.deleteSlot);

module.exports = router;
