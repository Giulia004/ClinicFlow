const ReportService = require('../services/reportService');

exports.createReport = async (req, res) => {
    try {

        await ReportService.createNewReport(req.body, req.file);
        res.status(200).json({ message: "Referto registrato con successo" });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

exports.getReportById = async (req, res) => {
    try {
        const report = await ReportService.getReportById(req.params.id);
        if (!report) return res.status(404).json({ message: "Referto non trovato" });

        return res.status(200).json(report);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

exports.getReportByDoc = async (req, res) => {
    try {
        const report = await ReportService.getReportsByDoc(req.params.medicoId);

        return res.status(200).json(report);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

exports.getReportPatientId = async (req, res) => {
    try {
        const report = await ReportService.getReportsByPatient(req.params.pazienteId);

        return res.status(200).json(report);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const result = await ReportService.deleteReport(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

exports.getAll = async (req, res) => {
    try {
        const reports = await ReportService.getAllReports();

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.downloadReportFile = async (req, res) => {
    try {
       const {filePath, filename} = await ReportService.getReportFileDetails(req.params.id);
        //Invia il file in modo sicuro al client
        res.download(filePath, filename);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}