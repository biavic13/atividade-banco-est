const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = 3000;

// Conexão com o MySQL
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'password',  // troque pela sua senha
  database: 'generos_musicais' // banco de dados de gêneros musicais
};

// Permitir que o front-end receba JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para listar gêneros musicais
app.get('/api/generos', async (req, res) => {
  try {
    const conexao = await mysql.createConnection(dbConfig);
    const [rows] = await conexao.execute('SELECT * FROM catalogo');
    await conexao.end();
    res.json(rows);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// Rota para adicionar gênero musical
app.post('/api/generos', async (req, res) => {
  const { nome, descricao, origem } = req.body;
  try {
    const conexao = await mysql.createConnection(dbConfig);
    await conexao.execute('INSERT INTO catalogo (nome, descricao, origem) VALUES (?, ?, ?)', [nome, descricao, origem]);
    await conexao.end();
    res.json({ mensagem: 'Gênero musical adicionado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
