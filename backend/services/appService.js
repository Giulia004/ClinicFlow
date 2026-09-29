const AppModel = require('../models/appModel');
const SlotModel = require('../models/slotModel');

class AppService {
    static async createNewAppointment(bodyData, userInfo) {
        let { paziente_id, slot_id } = bodyData;

        //Se l'utente è un paziente, forziamo l'id per sicurezza
        if (userInfo.role === 'paziente') paziente_id = userInfo.id;
        else paziente_id = Number(paziente_id);

        const creato_da = userInfo.role;
        slot_id = Number(slot_id);

        if (isNaN(paziente_id) || isNaN(slot_id))
            throw new Error("Dati appuntamento non valid");

        const slot = await SlotModel.getById(slot_id);
        if (!slot)
            throw new Error("Slot non trovato");
        if (slot.disponibile === 0)
            throw new Error("Slot già occupato");

        const appointmentData = {
            paziente_id,
            medico_id: slot.medico_id,
            stato: "attivo",
            creato_da,
            data_creazione: new Date().toISOString()
        };

        const appointment = await AppService.createNewAppointment(appointmentData);

        await SlotModel.bookSlot(slot_id);

        return appointment;
    }

    static async getAllAppointments() {
        return await AppModel.getAll();
    }

    static async getAppointmentById(id) {
        const result = await AppModel.getById(id);
        if (!result)
            throw new Error("Appuntamento non trovato");
        return result;
    }

    static async getAppointmentsByPatient(patientId) {
        if (!patientId)
            throw new Error("ID paziente non valido");

        const apps = await AppModel.getByPatientId(patientId);
        if (!apps || apps.length === 0)
            throw new Error("Nessun appuntamento trovato per il paziente");

        return apps;
    }

    static async unsubscribeAppointment(id) {
        const currentApp = await AppModel.getById(id);
        if (!currentApp) throw new Error("Appuntamento non trovato");
        if (currentApp.slot_id) await SlotModel.releaseSlot(currentApp.slot_id);

        return await AppModel.unsubscribeApp(id);
    }

    static async confirmAppointment(id) {
        const currentApp = await AppModel.getById(id);
        if (!currentApp) throw new Error("Appuntamento non trovato");

        return await AppModel.confirmApp(id);
    }
    static async completeAppointment(id) {
        const currentApp = await AppModel.getById(id);
        if (!currentApp) throw new Error("Appuntamento non trovato");

        return await AppModel.completeApp(id);
    }

    static async deleteAppointment(id) {
        const currentApp = await AppModel.getById(id);
        if (!currentApp) throw new Error("Appuntamento non trovato");

        return await AppModel.deleteApp(id);
    }

    static async getTodayAppointments() {
        const apps = await AppModel.getAll();
        const todayStr = new Date().toISOString().split('T')[0];

        return apps.filter(a => a.stato !== 'annullato' && a.data === todayStr);
    }
}

module.exports = AppService;