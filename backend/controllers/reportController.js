const path = require("path");
const ReportModel = require("../models/reportModel");
const fs = require("fs");

exports.createReport = async (req, res) => {
    try {
        const { appuntamento_id, paziente_id, medico_id } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "File referto mancante" });
        }

        if (!appuntamento_id || !medico_id || !paziente_id) {
            return res.status(400).json({ message: "Campi obbligatori mancanti: appuntamento_id e medico_id" });
        }

        const newReport = {
            appuntamento_id,
            paziente_id,
            medico_id,
            file_referto: req.file.filename
        };

        await ReportModel.createReport(newReport);
        res.status(200).json({ message: "Referto registrato con successo" });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

exports.getReportById = async (req, res) => {
    try {
        const report = await ReportModel.getById(req.params.id);
        if (!report) return res.status(404).json({ message: "Referto non trovato" });

        return res.status(200).json(report);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

exports.getReportByDoc = async (req, res) => {
    try {
        const report = await ReportModel.getByDocId(req.params.medicoId);

        return res.status(200).json(report);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

exports.getReportPatientId = async (req, res) => {
    try {
        const report = await ReportModel.getByPatientId(req.params.pazienteId);

        return res.status(200).json(report);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

exports.deleteReport = async (req, res) => {
    try {
        //Recupero del nome del file da DB
        const reportData = await ReportModel.getFileReport(req.params.id);
        if (!reportData)
            return res.status(404).json({ message: "Impossibile eliminare: referto non disponibile nel db" });
        
        //Eseguo la cancellazione
        const changes = await ReportModel.deleteReport(req.params.id);

        if (changes === 0)
            return res.status(404).json({ message: "Impossibile eliminare: referto inesistente" });

        //Cancellazione del file dalla cartella /uploads/reports
        const filePath = path.join(__dirname, '..', 'uploads', 'reports', reportData);
        if (fs.existsSync(filePath))
            fs.unlinkSync(filePath);

        res.status(200).json({ message: "Referto rimosso" });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

exports.getAll = async (req, res) => {
    try {
        const reports = await ReportModel.getAll();

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.downloadReportFile = async (req, res) => {
    try {
        const reportFile = await ReportModel.getFileReport(Number(req.params.id));

        if (!reportFile || !reportFile.file_referto) return res.status(404).json({ message: "File referto non trovato" });

        const filePath = path.join(process.cwd(),'uploads', 'reports', reportFile.file_referto);
        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File non trovato" });

        //Invia il file in modo sicuro al client
        res.download(filePath,reportFile.file_referto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}