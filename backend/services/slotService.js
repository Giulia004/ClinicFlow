const SlotModel = require('../models/slotModel');

class SlotService {
    //Creazione di un nuovo slot di prenotazione
    static async createNewSlot(slotData) {
        const { medico_id, date, orario_inizio, orario_fine } = slotData;

        if (!medico_id || !date || !orario_fine || !orario_fine) throw new Error("Dati mancanti: medico_id,date,orario_inizio e orario_fine");

        return await SlotModel.create(slotData);
    }

    //Recupero di tutti gli slot nel db
    static async getAllSlots() {
        return await SlotModel.getAllSlotsWithDoctors();
    }

    //Filtraggio degli slot in base a medico e/o data
    static async getFilteredSlot(medicoId, date) {
        return await SlotModel.getSlotsByFilter(medicoId, date);
    }

    //Prenotazione di uno slot
    static async bookSlot(slotId) {
        const slot = await SlotModel.getById(slotId);
        if (!slot) throw new Error("Slot non trovato");
        if (slot.disponibile === 0) throw new Error("Slot già prenotato");

        return await SlotModel.bookSlot(slotId);
    }

    //Rilascio o annullamento della prenotazione di uno slot
    static async releaseSlot(slotId) {
        const slot = await SlotModel.getById(slotId);
        if (!slot) throw new Error("Slot non trovato");

        return await SlotModel.releaseSlot(slotId);
    }

    //Eliminazione slot
    static async removeSlot(slotId) {
        const slot = await SlotModel.getById(slotId);
        if (!slotId) throw new Error("Impossibile eliminare: slot non trovato");

        const result = await SlotModel.deleteSlot(slotId);
        return { success: true, message: "Slot eliminato con successo.", ...result };
    }

    //Recupero slot disponibili per medico
    static async getByDocId(medico_id) {
        return await SlotModel.getByDocId(medico_id);
    }
}

module.exports = SlotService;