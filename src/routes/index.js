const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/auth');
const validateApiKey = require('../middlewares/apiKey'); // 1. Importe o middleware que você criou

// Rotas Públicas (Agora protegidas por API Key)
// 2. Adicione 'validateApiKey' antes do Controller
router.post('/register', validateApiKey, AuthController.register);
router.post('/login', validateApiKey, AuthController.login);

// Exemplo de Rota Privada (usa o middleware de autenticação JWT)
router.use(authMiddleware);

router.post('/logout', AuthController.logout);

module.exports = router;