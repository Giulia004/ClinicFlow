const express = require("express");
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require("fs");
const crypto = require('crypto');

const reportController = require("../controllers/reportController");
const verifyToken = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'reports');

//Se la cartella non esiste viene creata automaticamente
if (!fs.existsSync(UPLOAD_DIR))
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${crypto.randomUUID()}.pdf`;
        cb(null, uniqueName);
    }
});

//Filtro di sicurezza per garantire l'accettazione di soli file PDF
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf')
        cb(null, true);
    else cb(new Error("Formato file non valido"), false);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } //Limite massimo 5MB per file
});

router.use(verifyToken);

//Creazione nuovo referto
router.post("/",checkRole(["medico"]), upload.single('file_referto'), reportController.createReport);

//Recupero tutti i referti
router.get("/",checkRole(["admin","sportellista"]), reportController.getAll);

//Recupero dello storico dei referti di un determinato medico oppure paziente
router.get("/medico/:medicoId",checkRole(["admin","medico"]), reportController.getReportByDoc);
router.get("/paziente/:pazienteId",checkRole(["paziente","medico","sportellista"]), reportController.getReportPatientId);

//Scarica referto
router.get("/:id/download",checkRole(["admin","paziente","sportellista","medico"]), reportController.downloadReportFile);

//Recupero referto tramite il suo ID
router.get("/:id", checkRole(["admin","paziente","sportellista","medico"]),reportController.getReportById);

//Eliminazione referto
router.delete("/:id", checkRole(["admin"]),reportController.deleteReport);

module.exports = router;