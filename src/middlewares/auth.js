const jwt = require('jsonwebtoken');
const redis = require('redis');

// Configura o cliente Redis para checar a sessão
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

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
        // 1. Verifica se o JWT é válido e decodifica o ID do usuário
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 2. REQUISITO CHAVE: Verifica se o token existe no Redis
        // Se o usuário fez logout, a chave 'sessao:ID' não existirá mais
        const sessionToken = await redisClient.get(`sessao:${decoded.id}`);

        if (!sessionToken) {
            return res.status(401).send({ error: 'Sessão expirada ou inválida. Faça login novamente.' });
        }

        // 3. Se chegou aqui, está tudo OK!
        req.userId = decoded.id;
        return next();

    } catch (err) {
        return res.status(401).send({ error: 'Token inválido' });
    }
};