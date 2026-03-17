const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'O e-mail é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        // Validação de formato de e-mail
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, insira um e-mail válido']
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória'],
        minlength: [6, 'A senha deve ter no mínimo 6 caracteres'],
        select: false // Isso impede que a senha seja retornada em buscas comuns por segurança
    }
}, { timestamps: true });

// HOOK PRE-SAVE: Criptografa a senha antes de salvar no banco
userSchema.pre('save', async function (next) {
    // Só gera o hash se a senha for nova ou tiver sido modificada
    if (!this.isModified('password')) return next();

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

module.exports = mongoose.model('User', userSchema);