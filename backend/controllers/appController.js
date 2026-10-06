const AppService = require('../services/appService');

exports.createApp = async (req, res) => {
    try {
        const appointment = await AppService.createNewAppointment(req.body, req.user);
        return res.status(201).json({
            message: "Appuntamento fissato", appointment
        });
    } catch (error) {
        console.error(error.stack || error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const allApp = await AppService.getAllAppointments(req.user);

        return res.status(200).json(allApp);
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
};

exports.unsubApp = async (req, res) => {
    try {
        const appId = Number(req.params.id);

        await AppService.unsubscribeAppointment(appId);

        return res.status(200).json({ message: "Appuntamento disdetto" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.confirmApp = async (req, res) => {
    try {
        const appId = Number(req.params.id);

        await AppService.confirmAppointment(appId);

        return res.status(200).json({ message: "Appuntamento confermato" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.completeApp = async (req, res) => {
    try {
        const appId = Number(req.params.id);
        await AppService.completeAppointment(appId);
        return res.status(200).json({ message: "Appuntamento completato" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteApp = async (req, res) => {
    try {
        const appId = Number(req.params.id);
        await AppService.deleteAppointment(appId);
        return res.status(200).json({ message: "Appuntamento cancellato con successo" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getTodayAppointments = async (req, res) => {
    try {
        const apps = await AppService.getTodayAppointments();
        return res.status(200).json(apps);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};