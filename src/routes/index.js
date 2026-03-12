const express = require('express');
const routes = express.Router();
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/auth'); // Importamos o fiscal aqui em cima

// 1. Rota de Cadastro
routes.post('/register', AuthController.register);

// 2. Rota de Login (Onde o Redis será acionado)
routes.post('/login', AuthController.login);

// 3. Rota de Logout (Requisito do desafio: remove o token do Redis)
routes.post('/logout', authMiddleware, AuthController.logout);

// 4. Rota de Teste Protegida (O dashboard)
routes.get('/dashboard', authMiddleware, (req, res) => {
    res.send({
        message: "Parabéns! Você acessou uma rota protegida.",
        userId: req.userId
    });
});

module.exports = routes;