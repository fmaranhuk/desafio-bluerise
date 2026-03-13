const jwt = require('jsonwebtoken');
const redis = require('redis');

// CONFIGURAÇÃO CORRETA: Usa a variável do Railway ou o link direto
const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

// Conecta e evita que o erro derrube o servidor
redisClient.connect().catch(err => console.log('Redis Auth Error:', err.message));

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send({ error: 'Token não fornecido' });

    const parts = authHeader.split(' ');

    if (parts.length !== 2)
        return res.status(401).send({ error: 'Erro no token' });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token malformatado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verifica no Redis se a conexão estiver ativa
        if (redisClient.isOpen) {
            const sessionToken = await redisClient.get(`sessao:${decoded.id}`);
            if (!sessionToken) {
                return res.status(401).send({ error: 'Sessão expirada ou inválida.' });
            }
        }

        req.userId = decoded.id;
        return next();

    } catch (error) {
        console.error(error);
        return res.status(401).send({ error: 'Token inválido ou erro na sessão' });
    }
};