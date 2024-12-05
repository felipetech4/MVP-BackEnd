const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const path = require('path');

const caminhoBD = './db.json'; // Caminho do arquivo JSON

// Função para carregar o "banco de dados"
function carregarBanco() {
    return JSON.parse(fs.readFileSync(caminhoBD, 'utf8'));
}

// Função para salvar no "banco de dados"
function salvarBanco(dados) {
    fs.writeFileSync(caminhoBD, JSON.stringify(dados, null, 2));
}

// Função para gerar horários disponíveis (segunda a sexta, 8h às 18h)
function gerarHorariosDisponiveis() {
    const horarios = [];
    const horaInicio = 8; // 8h
    const horaFim = 18;  // 18h
    const hoje = new Date();
    const mesAtual = hoje.getMonth(); // Mês atual (0-11)

    for (let dia = 1; dia <= 15; dia++) { // Até 15 dias
        const data = new Date(hoje.getFullYear(), mesAtual, dia);

        if (data.getMonth() !== mesAtual) continue; // Ignora dias de outros meses

        for (let hora = horaInicio; hora < horaFim; hora++) {
            horarios.push({ dia, hora: `${hora}:00` });
        }
    }

    return horarios;
}

// Endpoint para pegar horários disponíveis
router.get('/disponiveis', (req, res) => {
    const banco = carregarBanco();
    const todosHorarios = gerarHorariosDisponiveis();

    // Filtra os horários já agendados
    const agendamentos = banco.agendamentos || [];
    const horariosDisponiveis = todosHorarios.filter(horario => {
        return !agendamentos.some(agenda =>
            agenda.dia === horario.dia && agenda.horario === horario.hora
        );
    });

    res.json(horariosDisponiveis);
});

// Endpoint para criar um novo agendamento
router.post('/criar', (req, res) => {
    const { nome, email, dia, horario } = req.body;

    if (!nome || !email || !dia || !horario) {
        return res.status(400).json({ message: 'Dados incompletos para agendamento.' });
    }

    const banco = carregarBanco();

    // Verifica se o agendamento já existe
    const agendamentoExistente = banco.agendamentos?.find(agenda =>
        agenda.dia === dia && agenda.horario === horario
    );

    if (agendamentoExistente) {
        return res.status(400).json({ message: 'Horário já agendado :(' });
    }

    // Cria um novo agendamento
    const novoAgendamento = {
        id: uuidv4(),
        nome,
        email,
        dia,
        horario
    };

    // Adiciona o agendamento ao banco
    banco.agendamentos = banco.agendamentos || [];
    banco.agendamentos.push(novoAgendamento);
    salvarBanco(banco);

    res.status(201).json({ message: 'Seu horário foi agendado com sucesso!', agendamento: novoAgendamento });
});

module.exports = router;
