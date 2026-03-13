const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redis = require('redis');

// CONFIGURAÇÃO CORRETA: Usa a variável do Railway
const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Controller Error:', err.message));

// Conecta uma única vez
(async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect().catch(console.error);
    }
})();

module.exports = {
    async register(req, res) {
        const { email, password } = req.body;
        try {
            if (await User.findOne({ email })) {
                return res.status(400).send({ error: 'Usuário já existe' });
            }
            const user = await User.create({ email, password });
            user.password = undefined;
            return res.send({ user, message: "Cadastrado com sucesso!" });
        } catch (err) {
            return res.status(400).send({ error: 'Falha no registro' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                return res.status(400).send({ error: 'Usuário não encontrado' });
            }

            if (!await bcrypt.compare(password, user.password)) {
                return res.status(400).send({ error: 'Senha inválida' });
            }

            user.password = undefined;

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 900,
            });

            // Só tenta gravar no Redis se o cliente estiver conectado
            if (redisClient.isOpen) {
                await redisClient.setEx(`sessao:${user.id}`, 900, token);
            }

            return res.send({ user, token });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Erro interno no login' });
        }
    },

    async logout(req, res) {
        try {
            if (redisClient.isOpen) {
                await redisClient.del(`sessao:${req.userId}`);
            }
            return res.send({ message: "Logout efetuado com sucesso!" });
        } catch (err) {
            return res.status(500).send({ error: 'Erro ao deslogar' });
        }
    }
};