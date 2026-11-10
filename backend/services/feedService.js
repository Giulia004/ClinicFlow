const FeedModel = require('../models/feedModel');
const AppModel = require('../models/appModel');

class FeedService {
    static async createNewFeedback(data, user) {
        const appuntamento_id = Number(data.appuntamento_id);
        const { voto, commento } = data;

        if (!appuntamento_id || voto === undefined)
            throw new Error("Dati mancanti");
        const appointment = await AppModel.getById(appuntamento_id);
        if (!appointment) throw new Error("Appuntamento non trovato");
        if (user.role !== 'paziente' || appointment.paziente_id !== user.id) {
            const error = new Error("Non autorizzato a valutare questo appuntamento");
            error.statusCode = 403;
            throw error;
        }
        if (appointment.stato !== 'completato')
            throw new Error("È possibile valutare solo un appuntamento completato");

        const numericVoto = Number(voto);
        if (isNaN(numericVoto) || numericVoto < 1 || numericVoto > 5)
            throw new Error("Il voto deve essere un numero compreso tra 1 e 5");

        const newFeedbackData = {
            appuntamento_id,
            paziente_id: appointment.paziente_id,
            medico_id: appointment.medico_id,
            voto: numericVoto,
            commento
        };

        return await FeedModel.createFeed(newFeedbackData);
    }

    static async getById(id, user) {
        const feedback = await FeedModel.getById(id);
        if (!feedback)
            throw new Error("Feedback non trovato");
        if (user.role !== 'admin' &&
            !((user.role === 'paziente' && feedback.paziente_id === user.id) ||
                (user.role === 'medico' && feedback.medico_id === user.id))) {
            const error = new Error("Non autorizzato ad accedere a questo feedback");
            error.statusCode = 403;
            throw error;
        }
        return feedback;
    }

    static async getByAppId(id) {
        const feedback = await FeedModel.getByAppId(id);
        if (!feedback)
            throw new Error("Nessun feedback trovato");
        return feedback;
    }
    
    static async getAllFeedbacks(user) {
        const allFeedback = user.role === 'admin'
            ? await FeedModel.getAll()
            : user.role === 'paziente'
                ? await FeedModel.getByPatientId(user.id)
                : user.role === 'medico'
                    ? await FeedModel.getByDoctorId(user.id)
                    : [];
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
        if (changes.updated === 0)
            throw new Error("Feedback non trovato");
        
        return { success: true, message: "Feedback rimosso" };
    }
}

module.exports = FeedService;