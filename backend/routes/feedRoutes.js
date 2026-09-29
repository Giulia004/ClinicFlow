const express = require("express");
const router = express.Router();

const feedController = require("../controllers/feedController");
const verifyToken = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");

router.use(verifyToken);

//Creazione nuovo feedback
router.post("/",checkRole(["paziente"]), feedController.createFeedback);

//Recupero di tutti i feedback del db
router.get("/",checkRole(["admin","paziente","medico"]), feedController.getAll);

router.get("/:id",checkRole(["paziente","medico","admin"]), feedController.getFeedById);

//Eliminazione feedback
router.delete("/:id",checkRole(["admin"]), feedController.deleteFeedback);

module.exports = router;