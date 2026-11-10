const ReportModel = require('../models/reportModel');
const AppModel = require('../models/appModel');
const path = require('path');
const fs = require('fs');

class ReportService {
    static async createNewReport(data, file, user) {
        if (!file) throw new Error("File referto mancante");
        const appointmentId = Number(data.appuntamento_id);
        if (!Number.isInteger(appointmentId) || appointmentId <= 0)
            throw new Error("ID appuntamento non valido");
        const appointment = await AppModel.getById(appointmentId);
        if (!appointment) throw new Error("Appuntamento non trovato");
        if (user.role !== 'medico' || appointment.medico_id !== user.id) {
            const error = new Error("Non autorizzato a creare un referto per questo appuntamento");
            error.statusCode = 403;
            throw error;
        }
        if (appointment.stato !== 'completato')
            throw new Error("Il referto può essere creato solo per un appuntamento completato");

        const newReport = {
            appuntamento_id: appointmentId,
            paziente_id: appointment.paziente_id,
            medico_id: appointment.medico_id,
            file_referto: file.filename
        };

        return await ReportModel.createReport(newReport);
    }

    static async authorizeReport(report, user) {
        if (user.role === 'admin' || user.role === 'sportellista' ||
            (user.role === 'paziente' && report.paziente_id === user.id) ||
            (user.role === 'medico' && report.medico_id === user.id)) return;
        const error = new Error("Non autorizzato ad accedere a questo referto");
        error.statusCode = 403;
        throw error;
    }

    static async getReportById(id, user) {
        const report = await ReportModel.getById(id);
        if (!report) throw new Error("Referto non trovato");
        await this.authorizeReport(report, user);
        return report;
    }

    static async getReportsByDoc(medicoId, user) {
        if (user.role !== 'admin' && (user.role !== 'medico' || Number(medicoId) !== user.id)) {
            const error = new Error("Non autorizzato ad accedere a questi referti");
            error.statusCode = 403;
            throw error;
        }
        return await ReportModel.getByDocId(medicoId);
    }

    static async getReportsByPatient(patientId, user) {
        const reports = await ReportModel.getByPatientId(patientId);
        if (user.role === 'paziente' && Number(patientId) !== user.id) {
            const error = new Error("Non autorizzato ad accedere a questi referti");
            error.statusCode = 403;
            throw error;
        }
        if (user.role === 'medico') {
            return reports.filter((report) => report.medico_id === user.id);
        }
        if (!['paziente', 'sportellista', 'admin'].includes(user.role)) {
            const error = new Error("Non autorizzato ad accedere a questi referti");
            error.statusCode = 403;
            throw error;
        }
        return reports;
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

        const filePath = path.join(__dirname, '..', 'uploads', 'reports', reportFile.file_referto);
        if (!fs.existsSync(filePath))
            throw new Error("File non trovato");

        return { filePath, filename: reportFile.file_referto };
    }
}

module.exports = ReportService;