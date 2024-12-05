const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());

// Middlewares
app.use(bodyParser.json()); // Para interpretar JSON no corpo das requisições

// Rotas
const rotasUsuarios = require('./routes/usuarios');
const rotasAgendamentos = require('./routes/agendamentos');

app.use('/api/usuarios', rotasUsuarios); // Rotas de usuários
app.use('/api/agendamentos', rotasAgendamentos); // Rotas de agendamentos

// Iniciar o servidor
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
