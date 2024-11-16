const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Caminho do arquivo JSON
const dbPath = './db.json';

// Função para carregar o "banco de dados"
function loadDB() {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// Função para salvar no "banco de dados"
function saveDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Função para gerar os horários de segunda a sexta de 8h às 18h, com intervalos de 1 hora
function generateAvailableTimes() {
    const times = [];
    const startHour = 8; // 8h
    const endHour = 18;  // 18h

    for (let day = 1; day <= 5; day++) { // Dias de segunda a sexta
        for (let hour = startHour; hour < endHour; hour++) {
            times.push({ day, hour: `${hour}:00` });
        }
    }
    return times;
}

// Endpoint para pegar as datas e horários disponíveis
router.get('/available', (req, res) => {
    const db = loadDB();
    const allTimes = generateAvailableTimes();

    // Filtra os horários já agendados
    const bookedSchedules = db.schedules || [];
    const availableTimes = allTimes.filter(timeSlot => {
        return !bookedSchedules.some(schedule =>
            schedule.date === timeSlot.day && schedule.time === timeSlot.hour
        );
    });

    res.json(availableTimes); // Retorna os horários disponíveis
});

// Cadastro de agendamento
router.post('/create', (req, res) => {
    const { name, email, date, time } = req.body;

    if (!name || !email || !date || !time) {
        return res.status(400).send('Todos os campos são obrigatórios!');
    }

    const db = loadDB();

    // Verifica se o horário já foi agendado
    const existingSchedule = db.schedules.find(schedule => schedule.date === date && schedule.time === time);
    if (existingSchedule) {
        return res.status(400).send('Horário já agendado!');
    }

    // Adiciona o novo agendamento
    const newSchedule = { id: uuidv4(), name, email, date, time };
    db.schedules.push(newSchedule);
    saveDB(db);

    res.status(201).send('Agendamento realizado com sucesso!');
});

module.exports = router;
