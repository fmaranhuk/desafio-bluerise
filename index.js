require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const cors = require('cors');
const path = require('path');
const routes = require('./src/routes');

const app = express();

// 1. CONFIGURAÇÕES INICIAIS
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 2. CONEXÃO COM O REDIS (USANDO A URL PÚBLICA DO RAILWAY)
const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => {
    console.log('⚠️ Redis offline ou conectando:', err.message);
});

(async () => {
    try {
        if (process.env.REDIS_URL) {
            await redisClient.connect();
            console.log('✅ Redis: Conectado');
        } else {
            console.log('⚠️ Redis: Variável REDIS_URL não encontrada');
        }
    } catch (err) {
        console.log('💡 App: Rodando em modo de segurança (sem Redis)');
    }
})();

// 3. ROTAS
app.use(routes);

// 4. CONEXÃO COM MONGODB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB: Conectado"))
    .catch((err) => console.error("❌ MongoDB: Erro na conexão", err));

// 5. INICIALIZAÇÃO DO SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor online na porta: ${PORT}`);
});