const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redis = require('redis');

// Conecta ao Redis dentro do controller
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

module.exports = {
    // Função de Cadastro
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

    // Função de Login
    async login(req, res) {
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
            expiresIn: 900, //  Requisito: Expiração de 15 min
        });

        //  Requisito: Armazenamento do token de sessão no Redis
        await redisClient.setEx(`sessao:${user.id}`, 900, token);

        return res.send({ user, token });
    },

    //  Requisito: Logout com remoção do token do Redis
    async logout(req, res) {
        try {
            // Remove do Redis usando o ID que o middleware injetou no req
            await redisClient.del(`sessao:${req.userId}`);
            return res.send({ message: "Logout efetuado com sucesso!" });
        } catch (err) {
            return res.status(500).send({ error: 'Erro ao deslogar' });
        }
    }
};