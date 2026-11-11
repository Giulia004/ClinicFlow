const FeedService = require('../services/feedService');

exports.createFeedback = async (req, res) => {
    try {
        const feedback = await FeedService.createNewFeedback(req.body, req.user);

        return res.status(201).json(feedback);

    } catch (error) {
        return res.status(error.statusCode || 400).json({ message: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const allFeedback = await FeedService.getAllFeedbacks(req.user);

        return res.status(200).json(allFeedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFeedById = async (req, res) => {
    try {
        const feedback = await FeedService.getById(req.params.id, req.user);

        res.status(200).json(feedback);
    } catch (err) {
        return res.status(err.statusCode || 404).json({ message: err.message });
    }
};

exports.getByAppId = async (req, res) => {
    try {
        const feedback = await FeedService.getByAppId(req.params.appuntamentoId);

        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
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