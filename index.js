// 1. Carrega as variáveis de ambiente (.env)
require('dotenv').config();

// 2. Importa as bibliotecas
const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const cors = require('cors');
const path = require('path');

// 3. Importa as rotas
const routes = require('./src/routes');

const app = express();

/** * 4. CONFIGURAÇÕES E MIDDLEWARES 
 */

app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos da pasta public (Seu HTML/CSS)
app.use(express.static(path.join(__dirname, 'public')));

/** * 5. CONEXÃO COM O REDIS 
 * Ajustado para funcionar dinamicamente no Railway ou Local
 */
const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`;

const redisClient = redis.createClient({
    url: redisUrl
});

redisClient.on('error', (err) => console.log('❌ Erro no Redis:', err));

(async () => {
    try {
        await redisClient.connect();
        console.log('✅ Conexão com Redis: OK!');
    } catch (err) {
        console.error('❌ Erro na conexão com Redis. Verifique as variáveis no Railway.');
    }
})();

/** * 6. ROTAS DO SISTEMA
 */
app.use(routes);

/** * 7. CONEXÃO COM O MONGODB
 */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conexão com MongoDB: OK!"))
    .catch((err) => console.error("❌ Erro ao conectar no MongoDB:", err));

/** * 8. INICIALIZAÇÃO DO SERVIDOR
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});