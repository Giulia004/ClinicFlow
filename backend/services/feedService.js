const FeedModel = require('../models/feedModel');

class FeedService {
    static async createNewFeedback(data) {
        const { appuntamento_id, paziente_id, medico_id, voto, commento } = data;

        if (!appuntamento_id || !paziente_id || !medico_id || voto === undefined)
            throw new Error("Dati mancanti");

        const numericVoto = Number(voto);
        if (isNaN(numericVoto) || numericVoto < 1 || numericVoto > 5)
            throw new Error("Il voto deve essere un numero compreso tra 1 e 5");

        const newFeedbackData = {
            appuntamento_id,
            paziente_id,
            medico_id,
            voto: numericVoto,
            commento
        };

        const insertId = await FeedModel.createFeed(newFeedbackData);
    }

    static async getById(id) {
        const feedback = await FeedModel.getById(id);
        if (!feedback)
            throw new Error("Feedback non trovato");
        return feedback;
    }

    static async getByAppId(id) {
        const feedback = await FeedModel.getByAppId(id);
        if (!feedback)
            throw new Error("Nessun feedback trovato");
        return feedback;
    }
    
    static async getAllFeedbacks() {
        const allFeedback = await FeedModel.getAll();
        if (!allFeedback || allFeedback.length === 0)
            throw new Error("Nessun feedback registrato");
        return allFeedback;
    }

    static async getFeedbacksByVoto(voto) {
        const numericVoto = parseInt(voto, 10);
        if (isNaN(numericVoto) || numericVoto < 1 || numericVoto > 5)
            throw new Error("Il parametro voto deve essere un intero compreso tra 1 e 5");

        const feedback = await FeedModel.getByVoto(numericVoto);
        if (!feedback || feedback.length === 0)
            throw new Error("Nessun feedback trovato");
        return feedback;
    }

    static async removeFeedback(id) {
        const changes = await FeedModel.deleteFeedback(id);
        if (changes === 0)
            throw new Error("Feedback non trovato");
        return { success: true, message: "Feedback rimosso" };
    }
}

module.exports = FeedService;