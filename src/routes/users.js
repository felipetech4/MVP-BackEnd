const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Para gerar IDs únicos
const router = express.Router();

const dbPath = './db.json'; // Caminho do arquivo JSON

// Função para carregar o "banco de dados"
function loadDB() {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// Função para salvar no "banco de dados"
function saveDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Cadastro de usuário
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Todos os campos são obrigatórios!');
    }

    const db = loadDB();

    // Verifica se o e-mail já existe
    if (db.users.some(user => user.email === email)) {
        return res.status(400).send('E-mail já cadastrado!');
    }

    // Adiciona o novo usuário
    const newUser = {
        id: uuidv4(),
        name,
        email,
        password // Obs: Em um app real, use hash para senhas (ex.: bcrypt)
    };

    db.users.push(newUser);
    saveDB(db);

    res.status(201).send('Usuário cadastrado com sucesso!');
});

// Login de usuário
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('E-mail e senha são obrigatórios!');
    }

    const db = loadDB();
    const user = db.users.find(user => user.email === email && user.password === password);

    if (!user) {
        return res.status(401).send('Credenciais inválidas!');
    }

    res.send(`Bem-vindo, ${user.name}!`);
});

module.exports = router;
