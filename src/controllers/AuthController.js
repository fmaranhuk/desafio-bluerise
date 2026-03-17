const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

module.exports = {
    async register(req, res) {
        const { email, password } = req.body;
        try {
            if (await User.findOne({ email })) {
                return res.status(400).send({ error: 'E-mail já cadastrado' });
            }

            const user = await User.create({ email, password });

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 900,
            });

            user.password = undefined;
            return res.send({ user, token, message: "Cadastrado com sucesso!" });
        } catch (err) {
            return res.status(400).send({ error: 'Falha no registro' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email }).select('+password');

            // Mensagem genérica para segurança (Resolve ponto 10 do PDF)
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).send({ error: 'E-mail ou senha inválidos' });
            }

            user.password = undefined;

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 900,
            });

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