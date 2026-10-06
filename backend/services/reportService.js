const ReportModel = require('../models/reportModel');
const path = require('path');
const fs = require('fs');

class ReportService {
    static async createNewReport(data, file) {
        if (!file) throw new Error("File referto mancante");
        if (!data.appuntamento_id || !data.medico_id || !data.paziente_id)
            throw new Error("Campi obbligatori mancanti: appuntamento_id, medico_id, paziente_id");

        const newReport = {
            appuntamento_id: data.appuntamento_id,
            paziente_id: data.paziente_id,
            medico_id: data.medico_id,
            file_referto: file.filename
        };

        return await ReportModel.createReport(newReport);
    }

    static async getReportById(id) {
        const report = await ReportModel.getById(id);
        if (!report) throw new Error("Referto non trovato");

        return report;
    }

    static async getReportsByDoc(medicoId) {
        return await ReportModel.getByDocId(medicoId);
    }

    static async getReportsByPatient(patientId) {
        return await ReportModel.getByPatientId(patientId);
    }

    static async getAllReports() {
        return await ReportModel.getAll();
    }

    static async deleteReport(id) {
        const reportData = await ReportModel.getById(id);
        if (!reportData || !reportData.file_referto)
            throw new Error("Impossibile eiminare: referto non disponibile nel database");

        const changes = await ReportModel.deleteReport(id);
        if (changes === 0)
            throw new Error("Impossibile eliminare: referto inesistente");

        //Cancellazione del file fisico della cartella /uploads/reports
        const filePath = path.join(__dirname, '..', 'uploads', 'reports', reportData.file_referto);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        return { success: true, message: "Referto rimosso" };
    }

    static async getReportFileDetails(id) {
        const reportFile = await ReportModel.getFileReport(Number(id));
        if (!reportFile || !reportFile.file_referto)
            throw new Error("File referto non trovato");

        const filePath = path.join(process.cwd(), 'uploads', 'reports', reportFile.file_referto);
        if (!fs.existsSync(filePath))
            throw new Error("File non trovato");

        return { filePath, filename: reportFile.file_referto };
    }
}

module.exports = ReportService;