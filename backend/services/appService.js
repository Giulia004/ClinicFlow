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

        if (!Number.isInteger(paziente_id) || paziente_id <= 0 || !Number.isInteger(slot_id) || slot_id <= 0)
            throw new Error("Dati appuntamento non valid");

        const slot = await SlotModel.getById(slot_id);
        if (!slot)
            throw new Error("Slot non trovato");
        if (!slot.disponibile)
            throw new Error("Slot già occupato");

        const appointmentData = {
            paziente_id,
            medico_id: slot.medico_id,
            slot_id,
            stato: "attivo",
            creato_da,
            data_creazione: new Date().toISOString()
        };

        const appointment = await AppModel.createApp(appointmentData);
        return appointment;
    }

    static async getAllAppointments(user) {
        const { role, id: userId } = user;
        let filterType = null;
        let filterId = null;

        if (role === 'paziente')
        {
            filterId = userId;
            filterType = 'paziente';
        } else if (role === 'medico') {
            filterType = 'medico';
            filterId = userId;
        }

        return await AppModel.getAllWithDetails(filterType, filterId);
    }

    static async getAppointmentById(id) {
        const result = await AppModel.getById(id);
        if (!result)
            throw new Error("Appuntamento non trovato");
        return result;
    }

    static async unsubscribeAppointment(id, user) {
        const currentApp = await AppModel.getById(id);
        if (!currentApp) throw new Error("Appuntamento non trovato");
        this.assertCanManageAppointment(currentApp, user, ['paziente', 'sportellista']);
        return await AppModel.unsubscribeApp(id);
    }

    static async confirmAppointment(id, user) {
        const currentApp = await AppModel.getById(id);
        if (!currentApp) throw new Error("Appuntamento non trovato");
        this.assertCanManageAppointment(currentApp, user, ['paziente', 'sportellista']);
        return await AppModel.confirmApp(id);
    }
    static async completeAppointment(id, user) {
        const currentApp = await AppModel.getById(id);
        if (!currentApp) throw new Error("Appuntamento non trovato");
        this.assertCanManageAppointment(currentApp, user, ['medico']);
        return await AppModel.completeApp(id);
    }

    static async deleteAppointment(id, user) {
        const currentApp = await AppModel.getById(id);
        if (!currentApp) throw new Error("Appuntamento non trovato");
        this.assertCanManageAppointment(currentApp, user, ['paziente', 'sportellista', 'admin']);
        return await AppModel.deleteApp(id);
    }

    static assertCanManageAppointment(appointment, user, permittedRoles) {
        const ownsAppointment =
            (user.role === 'paziente' && appointment.paziente_id === user.id) ||
            (user.role === 'medico' && appointment.medico_id === user.id);

        if (!permittedRoles.includes(user.role) || (['paziente', 'medico'].includes(user.role) && !ownsAppointment)) {
            const error = new Error("Non autorizzato a modificare questo appuntamento");
            error.statusCode = 403;
            throw error;
        }
    }

    static async getTodayAppointments() {
        const apps = await AppModel.getAllWithDetails();
        const todayStr = new Date().toISOString().split('T')[0];

        return apps.filter(a => a.stato !== 'annullato' && a.data === todayStr);
    }
}

module.exports = AppService;