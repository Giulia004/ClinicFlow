const ReportService = require('../services/reportService');
const fs = require('fs/promises');

exports.createReport = async (req, res) => {
    try {
        const id = await ReportService.createNewReport(req.body, req.file, req.user);
        return res.status(201).json({ message: "Referto registrato con successo", id });
    } catch (error) {
        if (req.file?.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (cleanupError) {
                if (cleanupError.code !== 'ENOENT') console.error("Errore durante la rimozione del referto non salvato:", cleanupError);
            }
        }
        return res.status(error.statusCode || 400).json({ message: error.message });
    }
};

exports.getReportById = async (req, res) => {
    try {
        const report = await ReportService.getReportById(req.params.id, req.user);
        if (!report) return res.status(404).json({ message: "Referto non trovato" });

        return res.status(200).json(report);
    } catch (error) {
        return res.status(error.statusCode || 404).json({ message: error.message });
    }
};

exports.getReportByDoc = async (req, res) => {
    try {
        const report = await ReportService.getReportsByDoc(req.params.medicoId, req.user);

        return res.status(200).json(report);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

exports.getReportPatientId = async (req, res) => {
    try {
        const report = await ReportService.getReportsByPatient(req.params.pazienteId, req.user);

        return res.status(200).json(report);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const result = await ReportService.deleteReport(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const reports = await ReportService.getAllReports();

        res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.downloadReportFile = async (req, res) => {
    try {
        await ReportService.getReportById(req.params.id, req.user);
        const {filePath, filename} = await ReportService.getReportFileDetails(req.params.id);
        //Invia il file in modo sicuro al client
        res.download(filePath, filename);
    } catch (error) {
        return res.status(error.statusCode || 404).json({ message: error.message });
    }
}