const fs = require('fs');
const xlsx = require('xlsx');

// Lê o arquivo db.json
const rawData = fs.readFileSync('./src/db.json', 'utf-8');
const jsonData = JSON.parse(rawData);

// Cria um novo workbook (arquivo Excel)
const workbook = xlsx.utils.book_new();

// Converte os dados do JSON para uma planilha
const worksheet = xlsx.utils.json_to_sheet(jsonData.users || []);
xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');

// Salva o arquivo Excel
xlsx.writeFile(workbook, 'dados.xlsx');

console.log('Arquivo Excel gerado com sucesso!');
