require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const cors = require('cors');
const path = require('path');
const routes = require('./src/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const redisUrl = process.env.REDIS_URL && process.env.REDIS_URL.startsWith('redis://')
    ? process.env.REDIS_URL
    : `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`;

const redisClient = redis.createClient({
    url: redisUrl,
    password: process.env.REDIS_PASSWORD || undefined
});

redisClient.on('error', (err) => console.log('Redis Error:', err.message));

(async () => {
    try {
        await redisClient.connect();
        console.log('✅ Redis: OK');
    } catch (err) {
        console.log('⚠️ Redis: Offline (Servidor rodando)');
    }
})();

app.use(routes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB: OK"))
    .catch((err) => console.error("❌ MongoDB: Error", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Port: ${PORT}`);
});