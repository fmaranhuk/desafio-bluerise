const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

module.exports = {
    // FUNÇÃO DE REGISTRO (CADASTRO)
    async register(req, res) {
        const { email, password } = req.body;
        try {
            // 1. Verifica se o e-mail já está no banco
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).send({ error: 'Este e-mail já está cadastrado.' });
            }

            // 2. Tenta criar o usuário (aqui as validações do Users.js entram em ação)
            const user = await User.create({ email, password });

            // 3. Gera o token para o novo usuário já logar direto
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 900,
            });

            // 4. Remove a senha do objeto de retorno por segurança
            user.password = undefined;

            return res.send({
                user,
                token,
                message: "Usuário criado com sucesso!"
            });

        } catch (err) {
            // Captura erros de validação (ex: senha < 6 caracteres ou e-mail inválido)
            if (err.name === 'ValidationError') {
                const message = Object.values(err.errors).map(val => val.message);
                return res.status(400).send({ error: message.join(', ') });
            }
            return res.status(400).send({ error: 'Não foi possível completar o cadastro.' });
        }
    },

    // FUNÇÃO DE LOGIN
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Busca o usuário e força a vinda da senha para comparação
            const user = await User.findOne({ email }).select('+password');

            // Mensagem genérica para evitar que hackers descubram quais e-mails existem
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).send({ error: 'E-mail ou senha inválidos' });
            }

            user.password = undefined;

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 900, // 15 minutos
            });

            // Salva a sessão no Redis se ele estiver conectado
            if (redisClient.isOpen) {
                await redisClient.setEx(`sessao:${user.id}`, 900, token);
            }

            return res.send({ user, token });

        } catch (error) {
            console.error("Erro no login:", error);
            return res.status(500).send({ error: 'Erro interno no servidor ao tentar logar.' });
        }
    },

    // FUNÇÃO DE LOGOUT
    async logout(req, res) {
        try {
            // Remove a chave do Redis para invalidar a sessão
            if (redisClient.isOpen) {
                await redisClient.del(`sessao:${req.userId}`);
            }
            return res.send({ message: "Logout efetuado com sucesso!" });
        } catch (err) {
            return res.status(500).send({ error: 'Erro ao processar logout no servidor.' });
        }
    }
};