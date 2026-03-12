const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false // Isso impede que a senha vaze em buscas simples
    }
});

// Criptografar a senha antes de salvar no banco
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return next();

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
});

module.exports = mongoose.model('User', UserSchema);