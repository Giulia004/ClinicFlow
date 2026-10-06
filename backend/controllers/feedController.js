const FeedService = require('../services/feedService');

exports.createFeedback = async (req, res) => {
    try {
        const feedback = await FeedService.createNewFeedback(req.body);

        res.status(200).json(feedback);

    } catch (error) {
        console.error("ERRORE NEL MODEL/DB:", error);
        res.status(500).json(error.message);
    }
};

exports.getAll = async (req, res) => {
    try {
        const allFeedback = await FeedService.getAllFeedbacks();

        return res.status(200).json(allFeedback);
    } catch (error) {
        console.log("Errore nel controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.getFeedById = async (req, res) => {
    try {
        const feedback = await FeedService.getById(req.params.id);

        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

exports.getByAppId = async (req, res) => {
    try {
        const feedback = await FeedService.getByAppId(req.params.appuntamentoId);

        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

exports.getFeedByVoto = async (req, res) => {
    try {
        const feedback = await FeedService.getFeedbacksByVoto(req.params.voto);

        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const result= await FeedService.removeFeedback(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err.message);
    }
};