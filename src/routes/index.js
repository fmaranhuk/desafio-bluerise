require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const cors = require('cors');
const path = require('path');
const routes = require('./src/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração de conexão flexível
const redisUrl = process.env.REDIS_URL || `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const redisClient = redis.createClient({
    url: redisUrl
});

redisClient.on('error', (err) => console.log('⚠️ Redis offline:', err.message));

(async () => {
    try {
        await redisClient.connect();
        console.log('✅ Redis: Conectado com sucesso');
    } catch (err) {
        console.log('💡 App: Rodando sem Redis (Modo de segurança)');
    }
})();

app.use(routes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB: Conectado"))
    .catch((err) => console.error("❌ MongoDB: Erro na conexão", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor online na porta: ${PORT}`);
});