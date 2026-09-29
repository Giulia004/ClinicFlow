const AppModel = require("../models/appModel");
const SlotModel = require("../models/slotModel");

exports.createApp = async (req, res) => {
    try {
        let { paziente_id, slot_id } = req.body;

        //Il paziente_id e il "creato_da" derivano dal token, non dal body, per evitare che un utente prenoti per conto di un altro
        if (req.user.role === "paziente") {
            paziente_id = req.user.id;
        } else {
            paziente_id = Number(paziente_id);
        }
        const creato_da = req.user.role;

        slot_id = Number(slot_id);

        if (isNaN(paziente_id) || isNaN(slot_id) || !paziente_id || !slot_id) return res.status(400).json({ message: "Dati appuntamento non validi" });

        const slot = await SlotModel.getById(slot_id);

        //Controllo l'esistenza dello slot
        if (!slot) return res.status(404).json({ message: "Slot non trovato" });

        //Controllo la disponibilità dello slot
        if (slot.disponibile === 0) return res.status(400).json({ message: "Slot già occupato" });

        //Creazione appuntamento
        try {
            const appointmentData = {
                paziente_id,
                medico_id: slot.medico_id,
                slot_id: Number(slot_id),
                stato: "attivo",
                creato_da,
                data_creazione: new Date().toISOString()
            };

            const appointment = await AppModel.createApp(appointmentData);

            //Aggiornamento disponibilità slot
            await SlotModel.bookSlot(slot_id);
            return res.status(200).json({ message: "Appuntamento fissato" },appointment);
        } catch (err) {
            console.error('Errore createApp:', err);
            if (err.message && err.message.includes('Dati mancanti')) return res.status(400).json({ message: err.message });
            throw err;
        }
    } catch (error) {
        console.error(error.stack || error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const { role, id: userId } = req.user;

        let filterType = null;
        let filterId = null;

        if (role === 'paziente') {
            filterId = userId;
            filterType = 'paziente';
        } else if (role === 'medico') {
            filterType = 'medico';
            filterId = userId;
        }
        const allApp = await AppModel.getAllWithDetails(filterType, filterId);

        return res.status(200).json(allApp);
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
};

exports.unsubApp = async (req, res) => {
    try {
        const appId = Number(req.params.id);

        const currentApp = await AppModel.getById(appId);

        if (!currentApp) return res.status(404).json({ message: "Appuntamento non trovato" });

        if (currentApp.slot_id) await SlotModel.releaseSlot(currentApp.slot_id);

        await AppModel.unsubscribeApp(appId);

        return res.status(200).json({ message: "Appuntamento disdetto" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.confirmApp = async (req, res) => {
    try {
        const appId = Number(req.params.id);

        const currentApp = await AppModel.getById(appId);

        if (!currentApp) return res.status(404).json({ message: "Appuntamento non trovato" });

        await AppModel.confirmApp(appId);

        return res.status(200).json({ message: "Appuntamento confermato" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.completeApp = async (req, res) => {
    try {
        const currentApp = await AppModel.getById(Number(req.params.id));
        if (!currentApp) return res.status(404).json({ message: "Appuntamento non trovato" });
        await AppModel.completeApp(Number(req.params.id));
        return res.status(200).json({ message: "Appuntamento completato" });
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
};

exports.deleteApp = async (req, res) => {
    try {
        const appId = Number(req.params.id);

        const currentApp = await AppModel.getById(appId);


        if (!currentApp) return res.status(404).json({ message: "Appuntamento non trovato" });

        await AppModel.deleteApp(appId);

        return res.status(200).json({ message: "Appuntamento cancellato con successo" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getTodayAppointments = async (req, res) => {
    try {
        const apps = await AppModel.getAll();

        const todayStr = new Date().toISOString().split('T')[0];

        //Filtro gli appuntamenti per la data odierna
        const todayApps = apps.filter(a => {
            return a.stato !== 'annullato' && a.data === todayStr;
        });

        return res.status(200).json(todayApps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
