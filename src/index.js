const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());

// Middlewares
app.use(bodyParser.json()); // Para interpretar JSON no corpo das requisições

// Rotas
const userRoutes = require('./routes/users');
const scheduleRoutes = require('./routes/schedule');

app.use('/api/users', userRoutes); // Rotas de usuários
app.use('/api/schedules', scheduleRoutes); // Rotas de agendamentos

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
