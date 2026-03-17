const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');

    if (!parts.length === 2) {
        return res.status(401).send({ error: 'Erro no token' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Token malformado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;

        // Verifica se a sessão ainda existe no Redis
        if (redisClient.isOpen) {
            const session = await redisClient.get(`sessao:${decoded.id}`);
            if (!session) {
                return res.status(401).send({ error: 'Sessão expirada ou inválida' });
            }
        }

        return next();
    } catch (err) {
        return res.status(401).send({ error: 'Token inválido' });
    }
};