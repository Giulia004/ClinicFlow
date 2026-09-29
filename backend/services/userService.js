const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

class UserService {
    //Logica di registrazione: controlli, hashing password e salvataggio
    static async registerUser(userData, details) {
        //Verifico se l'utente esiste già
        const existingUser = await UserModel.findByCf(userData.cf);
        if (existingUser) throw new Error("Esiste già un utente registrato con questo Codice Fiscale");

        //Hashing della password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const userToCreate = {
            ...userData,
            password: hashedPassword
        };

        return await UserModel.create(userToCreate, details);
    }

    //Recupero degli utenti mediante CF con gestione dell'errore se non esiste
    static async getUserByCf(cf) {
        const user = UserModel.findByCf(cf);
        if (!user) throw new Error("Utente non trovato");

        return user;
    }

    //Aggiornamento delle informazioni relative all'utente
    static async updateUserData(cf, data) {
        let updateData = { ...data };

        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(data.password, salt);
        }

        const result = await UserModel.updateUser(cf, updateData);
        return result;
    }

    //Eliminazione utente
    static async deleteUser(cf) {
        const result = await UserModel.deleteUser(cf);
        if (result.deleted === 0) throw new Error("Impossibile eliminare: utente non trovato");
        return { success: true, message: "Utente eliminato con successo." };
    }

    //Recupero di tutti gli utenti
    static async gelAllUsers() {
        return await UserModel.getAllUsers();
    }

    static async getAllDoctors() {
        return await UserModel.getAllDoc();
    }
}

module.exports = UserService;