const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const userController = require("../controllers/userController");
const { checkRole } = require("../middleware/roleMiddleware");

router.use(authMiddleware);

//Registrazione nuovo utente
router.post("/", userController.registerUser);

//Gestione lista globale
router.get("/",checkRole(["admin","medico","sportellista"]), userController.getUsers);

//Lista di tutti i medici registrati
router.get("/medici", userController.getAllDoc);

//Lista di tutti i pazienti registrati
router.get("/pazienti",checkRole(["medico","sportellista","admin"]), userController.getAllPatients);

//Recupero dell'user tramite il codice fiscale
router.get("/:cf", userController.getUserByCf);

//Chiamata per update del profile utente
router.put("/:cf",checkRole(["medico","sportellista","admin","paziente"]), userController.updateUser);

//Eliminazione dell'utente dal db. Solo l'admin può eseguire questa operazione
router.delete("/:cf", userController.deleteUser);


module.exports = router;