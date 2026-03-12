// 1. Carrega as variáveis de ambiente (.env)
require('dotenv').config();

// 2. Importa as bibliotecas
const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const cors = require('cors'); // Para permitir que o navegador acesse o servidor
const path = require('path');

// 3. Importa as rotas
const routes = require('./src/routes');

const app = express();

/** * 4. CONFIGURAÇÕES E MIDDLEWARES 
 */
app.use(cors()); // Habilita o CORS primeiro de tudo
app.use(express.json()); // Permite ler JSON no corpo das requisições

// Serve os arquivos estáticos da pasta 'public'
// É essa linha que faz o http://localhost:3000/index.html funcionar!
app.use(express.static(path.join(__dirname, 'public')));

/** * 5. CONEXÃO COM O REDIS 
 */
const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('❌ Erro no Redis:', err));

(async () => {
    try {
        await redisClient.connect();
        console.log('✅ Conexão com Redis: OK!');
    } catch (err) {
        console.error('❌ Não foi possível conectar ao Redis. Verifique se o Docker está rodando.');
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
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`👉 Tente acessar: http://localhost:${PORT}/index.html`);
});