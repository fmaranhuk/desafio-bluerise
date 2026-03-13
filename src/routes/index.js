const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController'); // Verifique se o nome do arquivo é AuthController.js
const authMiddleware = require('../middlewares/auth');

// Rotas Públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Exemplo de Rota Privada (usa o middleware de autenticação)
router.use(authMiddleware);

router.post('/logout', AuthController.logout);

module.exports = router;