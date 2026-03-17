const redis = require('redis');

// Cria uma ÚNICA instância do cliente
const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error:', err));

// Função que inicia a conexão (executada uma vez)
(async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('Conexão única com Redis estabelecida!');
    }
})();

// Exporta a instância para o resto do projeto
module.exports = redisClient;