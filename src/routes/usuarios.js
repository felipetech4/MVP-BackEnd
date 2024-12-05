const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Para gerar IDs únicos
const router = express.Router();

const caminhoBD = './db.json'; // Caminho do arquivo JSON

// Função para carregar o "banco de dados"
function carregarBanco() {
    return JSON.parse(fs.readFileSync(caminhoBD, 'utf8'));
}

// Função para salvar no "banco de dados"
function salvarBanco(dados) {
    fs.writeFileSync(caminhoBD, JSON.stringify(dados, null, 2));
}

// Cadastro de usuário
router.post('/cadastrar', (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).send('Todos os campos são obrigatórios!');
    }

    const banco = carregarBanco();

    // Verifica se o e-mail já existe
    if (banco.usuarios.some(usuario => usuario.email === email)) {
        return res.status(400).send('E-mail já cadastrado!');
    }

    // Adiciona o novo usuário
    const novoUsuario = {
        id: uuidv4(),
        nome,
        email,
        senha // Em um app real, use hash para senhas (ex.: bcrypt)
    };

    banco.usuarios.push(novoUsuario);
    salvarBanco(banco);

    res.status(201).send('Usuário cadastrado com sucesso!');
});

// Login de usuário
router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).send('E-mail e senha são obrigatórios!');
    }

    const banco = carregarBanco();
    const usuario = banco.usuarios.find(usuario => usuario.email === email && usuario.senha === senha);

    if (!usuario) {
        return res.status(401).send('Credenciais inválidas!');
    }

    res.send(`Bem-vindo, ${usuario.nome}!`);
});

module.exports = router;
