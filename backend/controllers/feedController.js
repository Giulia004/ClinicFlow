const FeedModel = require("../models/feedModel");

exports.createFeedback = async (req, res) => {
    console.log("-> ROTTA POST /api/feedback RAGGIUNTA CON CORPO:", req.body);
    try {
        const { appuntamento_id, paziente_id, medico_id, voto, commento } = req.body;

        if (!appuntamento_id || !paziente_id || !medico_id || voto === undefined)
            return res.status(400).json({ message: "Dati mancanti" });

        if (voto < 1 || voto > 5)
            return res.status(400).json({ message: "Il voto deve essere un intero compreso tra 1 e 5" });

        const newFeedback = { appuntamento_id, paziente_id, medico_id, voto, commento };

        const feedback = await FeedModel.createFeed(newFeedback);

        res.status(200).json(feedback);

    } catch (error) {
        console.error("ERRORE NEL MODEL/DB:", error);
        res.status(500).json(error.message);
    }
};

exports.getAll = async (req, res) => {
    try {
        const allFeedback = await FeedModel.getAll();

        if (!allFeedback) res.status(404).json({ message: "Nessun feedback registrato" });
        console.log(allFeedback);
        return res.status(200).json(allFeedback);
    } catch (error) {
        console.log("Errore nel controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.getFeedById = async (req, res) => {
    try {
        const feedback = await FeedModel.getById(req.params.id);

        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

exports.getByAppId = async (req, res) => {
    try {
        const feedback = await FeedModel.getByAppId(req.params.appuntamentoId);

        if (!feedback)
            return res.status(404).json({ message: "Feedback non trovato" });

        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

exports.getFeedByVoto = async (req, res) => {
    try {
        const voto = parseInt(req.params.voto, 10);

        if (isNaN(voto) || voto < 1 || voto > 5)
            return res.status(400).json({ message: "Il parametro voto deve essere un intero compreso tra 1 e 5" });

        const feedback = await FeedModel.getByVoto(voto);

        if (!feedback)
            return res.status(404).json({ message: "Feedback non trovato" });

        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const changes = await FeedModel.deleteFeedback(req.params.id);

        if (changes === 0)
            return res.status(404).json({ message: "Feedback non trovato" });

        res.status(200).json({ message: "Feedback rimosso" });
    } catch (err) {
        res.status(500).json(err.message);
    }
};