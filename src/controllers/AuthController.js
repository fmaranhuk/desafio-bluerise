const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

module.exports = {
    async register(req, res) {
        const { email, password } = req.body;
        try {
            // Verifica se o e-mail já existe
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).send({ error: 'Este e-mail já está cadastrado.' });
            }

            // Cria o usuário
            const user = await User.create({ email, password });

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 900,
            });

            user.password = undefined;
            return res.send({ user, token, message: "Usuário criado com sucesso!" });

        } catch (err) {
            // Se o erro for de validação (ex: senha curta ou e-mail inválido)
            if (err.name === 'ValidationError') {
                const messages = Object.values(err.errors).map(val => val.message);
                return res.status(400).send({ error: messages.join(', ') });
            }
            // Log para você ver no terminal do Railway o que houve
            console.error("Erro no registro:", err);
            return res.status(400).send({ error: 'Erro ao salvar os dados.' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email }).select('+password');

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).send({ error: 'E-mail ou senha inválidos' });
            }

            user.password = undefined;
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 900 });

            if (redisClient.isOpen) {
                await redisClient.setEx(`sessao:${user.id}`, 900, token);
            }

            return res.send({ user, token });
        } catch (error) {
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