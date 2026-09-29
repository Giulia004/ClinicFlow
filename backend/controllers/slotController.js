const SlotModel = require("../models/slotModel");

exports.createSlot = async (req, res) => {
    try {
        const { medico_id, date, orario_inizio, orario_fine } = req.body;

        if (!medico_id || !date || !orario_inizio || !orario_fine)
            return res.status(400).json({ error: "Tutti i campi sono obbligatori" });

        await SlotModel.create({ medico_id: Number(medico_id), date, orario_inizio, orario_fine });
        return res.status(201).json({ message: "Nuovo slot creato" });
    } catch (error) {
        if (error.message.includes("Slot sovrapposto"))
            return res.status(409).json({ error: error.message });

        return res.status(500).json({ error: "Errore interno", details: error.message.details });
    }
};

exports.getSlotByFilter = async (req, res) => {
    try {
        let medico_id = req.params.medicoId;
        let date = req.query.date;

        if (medico_id == 'undefined' || medico_id === 'null' || !medico_id)
            medico_id = null;

        if (date == 'undefined' || date === 'null' || !date || date.trim() === '')
            date = null;

        const slots = await SlotModel.getSlotsByFilter(medico_id, date);
        return res.status(200).json(slots);
    } catch (error) {
        return res.status(500).json({ error: "Errore durante il recupero degli slot",details:error.message.details });
    }
};

//Recupero tutti gli slot
exports.getAllSlot = async (req, res) => {
    try {
        let { medico_id, date } = req.query;

        if (medico_id === 'undefined' || medico_id === 'null' || !medico_id) medico_id = null;
        if (date === 'undefined' || date === 'null' || !date) date = null;

        const slots = await SlotModel.getAllSlots();
        return res.status(200).json(slots);
    } catch (error) {
        return res.status(500).json({ error: "Errore", details: error.message });
    }
};

//Prenotazione slot
exports.bookSlot = async (req, res) => {
    try {
        const slotId = Number(req.params.id);

        const result = await SlotModel.bookSlot(slotId);

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

        const result = await SlotModel.releaseSlot(slotId);

        return res.status(200).json({ message: "Slot liberato", result });
    } catch (error) {
        return res.status(500).json({ error: "Errore", details: error.message });
    }
};

//Elimina slot
exports.deleteSlot = async (req, res) => {
    try {
        const slotId = Number(req.params.id);

        if (!slotId) return res.status(400).json({ message: "ID non valido" });

        const slot = await SlotModel.getById(slotId);
        if (!slot) return res.status(404).json({ message: "Slot non trovato" });

        if (slot.disponibile === 0)
            return res.status(400).json({ message: "Impossibile eliminare un slot occupato" });

        const result = await SlotModel.deleteSlot(slotId);

        return res.status(200).json({ message: "Slot eliminato", result });
    } catch (error) {
        return res.status(500).json({ error: "Errore", details: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const slotId = Number(req.params.id);

        const slot = await SlotModel.getById(slotId);

        if (!slot) return res.status(404).json({ message: "Slot non trovato" });

        return res.status(200).json(slot);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.updateSlot = async (req, res) => {
    try {
        const slotId = Number(req.params.id);
        if (!slotId) res.status(404).json({ message: "ID non trovato" });

        const { medico_id, date, orario_inizio, orario_fine } = req.body;
        if (!medico_id || !date || !orario_inizio || !orario_fine) res.status(400).json({ error: "Tutti i campi sono obbligatori" });

        const updatedSlot = await SlotModel.update(slotId, {
            medico_id: Number(medico_id),
            date,
            orario_inizio,
            orario_fine
        });

        res.status(200).json({ message: "Slot aggiornato con successo", updatedSlot });
    } catch (error) {
        if (error.message.includes("Slot non trovato"))
            res.status(404).json({ message: error.message });
        res.status(500).json({ error: "Errore interno", details: error.message.details });
    }
};