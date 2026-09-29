require('dotenv').config();
const express = require('express'); //Importare express
const cors = require('cors');
const path = require('path');

const app = express();

//Porta server
const PORT = process.env.PORT;

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders:['Content-Disposition']
})); //Abilita CORS per tutte le rotte

app.use(express.json()); //Il server leggerà i dati in formato JSON

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

//Routes
app.use('/api/auth', require("./routes/authRoutes"));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/slots', require('./routes/slotRoutes'));
app.use('/api/appointments', require("./routes/appRoutes"));
app.use('/api/reports', require("./routes/reportRoutes"));
app.use('/api/feedback', require("./routes/feedRoutes"));

app.get('/', (req, res) => {
    res.json({ status: "online", message: "ClinicFlow Server" });
});

app.use((req, res) => {
    res.status(404).json({ message: "Endpoint non trovato" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Errore interno del server" });
});

//Avvio server
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});