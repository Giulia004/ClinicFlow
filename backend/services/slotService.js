const SlotModel = require('../models/slotModel');

class SlotService {
    //Creazione di un nuovo slot di prenotazione
    static async createNewSlot(slotData, requester) {
        const { date, orario_inizio, orario_fine } = slotData;
        const medico_id = requester.role === 'medico' ? requester.id : Number(slotData.medico_id);

        if (!medico_id || !date || !orario_inizio || !orario_fine) throw new Error("Dati mancanti: medico_id,date,orario_inizio e orario_fine");

        const formattedData = {
            medico_id: Number(medico_id),
            date: date,
            orario_inizio,
            orario_fine,
        }
        return await SlotModel.create(formattedData);
    }

    //Recupero di tutti gli slot nel db
    static async getAllSlots() {
        return await SlotModel.getAllSlots();
    }

    //Filtraggio degli slot in base a medico e/o data
    static async getFilteredSlot(medicoId, date) {
        let parseMedicoId = medicoId;
        let parseDate = date;

        if (parseMedicoId === 'undefined' || parseMedicoId === 'null' || !parseMedicoId) parseMedicoId = null;
        
        if (parseDate === 'undefined' || parseDate === 'null' || !parseDate || parseDate.trim() === '') parseDate = null;

        return await SlotModel.getSlotsByFilter(parseMedicoId,parseDate);
    }

    static async getSlotById(slotId) {
        const slot = await SlotModel.getById(slotId);
        if (!slot) throw new Error("Slot non trovato");
        return slot;
    }
    
    //Prenotazione di uno slot
    static async bookSlot(slotId) {
        const slot = await SlotModel.getById(slotId);
        if (!slot) throw new Error("Slot non trovato");
        if (!slot.disponibile) throw new Error("Slot già prenotato");

        return await SlotModel.bookSlot(slotId);
    }

    //Rilascio o annullamento della prenotazione di uno slot
    static async releaseSlot(slotId, requester) {
        const slot = await SlotModel.getById(slotId);
        if (!slot) throw new Error("Slot non trovato");

        if (requester.role !== 'admin' && requester.role !== 'sportellista' &&
            (requester.role !== 'medico' || requester.id !== slot.medico_id)) {
            const error = new Error("Non autorizzato a liberare questo slot");
            error.statusCode = 403;
            throw error;
        }

        const result = await SlotModel.releaseSlot(slotId);
        if (result.updated === 0)
            throw new Error("Slot non occupato o associato a un appuntamento attivo");
        return result;
    }

    static async updateSlot(slotId, slotData) {
        if (!slotId) throw new Error("ID slot mancante");
        
        const { medico_id, date, orario_inizio, orario_fine } = slotData;
        if (!medico_id || !date || !orario_inizio || !orario_fine) throw new Error("Dati mancanti: medico_id,date,orario_inizio e orario_fine");

        const updatedSlot = await SlotModel.update(slotId, { medico_id: Number(medico_id), date, orario_inizio, orario_fine });
        
        if (!updatedSlot) throw new Error("Impossibile aggiornare: slot non trovato");
        
        return updatedSlot;
    }

    //Eliminazione slot
    static async removeSlot(slotId) {
        if (!slotId) throw new Error("ID slot mancante");
        
        const slot = await SlotModel.getById(slotId);
        if (!slot) throw new Error("Impossibile eliminare: slot non trovato");

        if (slot.disponibile === 0) throw new Error("Impossibile eliminare uno slot occupato");
        
        const result = await SlotModel.deleteSlot(slotId);
        return { success: true, message: "Slot eliminato con successo.", result };
    }

    //Recupero slot disponibili per medico
    static async getByDocId(medico_id) {
        return await SlotModel.getByDocId(medico_id);
    }
}

module.exports = SlotService;