const SlotService = require('../services/slotService');

exports.createSlot = async (req, res) => {
    try {
        await SlotService.createNewSlot(req.body);
        return res.status(201).json({ message: "Nuovo slot creato" });
    } catch (error) {
        if (error.message.includes("Slot sovrapposto"))
            return res.status(409).json({ error: error.message });

        return res.status(500).json({ error: "Errore interno", details: error.message.details });
    }
};

exports.getSlotByFilter = async (req, res) => {
    try {
        const slots = await SlotService.getFilteredSlot(req.params.medicoId, req.query.date);
        return res.status(200).json(slots);
    } catch (error) {
        return res.status(500).json({ error: "Errore durante il recupero degli slot", details: error.message.details });
    }
};

//Recupero tutti gli slot
exports.getAllSlot = async (req, res) => {
    try {
        const slots = await SlotService.getAllSlots();
        return res.status(200).json(slots);
    } catch (error) {
        return res.status(500).json({ error: "Errore", details: error.message });
    }
};

//Prenotazione slot
exports.bookSlot = async (req, res) => {
    try {
        const slotId = Number(req.params.id);
        const result = await SlotService.bookSlot(slotId);

        return res.status(200).json({ message: "Slot prenotato", result });
    } catch (error) {
        if (error.message.includes("Slot già occupato")) {
            return res.status(409).json({ error: error.message });
        }
        return res.status(500).json({ error: "Errore", details: error.message });
    }
};

//Libera slot
exports.releaseSlot = async (req, res) => {
    try {
        const slotId = Number(req.params.id);

        const result = await SlotService.releaseSlot(slotId);

        return res.status(200).json({ message: "Slot liberato", result });
    } catch (error) {
        return res.status(500).json({ error: "Errore", details: error.message });
    }
};

//Elimina slot
exports.deleteSlot = async (req, res) => {
    try {
        const slotId = Number(req.params.id);
        const result = await SlotService.removeSlot(slotId);

        return res.status(200).json({ message: "Slot eliminato", result });
    } catch (error) {
        return res.status(500).json({ error: "Errore", details: error.message });
    }
};

//Recupero dello slot mediante il suo id
exports.getById = async (req, res) => {
    try {
        const slotId = Number(req.params.id);
        const slot = await SlotService.getSlotById(slotId);

        return res.status(200).json(slot);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//Aggiornamento informazioni slot
exports.updateSlot = async (req, res) => {
    try {
        const slotId = Number(req.params.id);

        const updatedSlot = await SlotService.updateSlot(slotId, req.body);

        res.status(200).json({ message: "Slot aggiornato con successo", updatedSlot });
    } catch (error) {
        return res.status(500).json({ error: "Errore", details: error.message });
    }
};
