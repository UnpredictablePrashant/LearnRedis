const express = require('express');
const router = express.Router();
const redisClient = require('../redisClient');

router.post('/set', async (req, res) => {
    const { key, value } = req.body;
    try {
        const existingValue = await redisClient.get(key);
        if (existingValue !== null) {
            await redisClient.set(key, value);
        } else {
            await redisClient.set(key, value);
        }
        res.send({ msg: 'OK' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/get/:key', async (req, res) => {
    const key = req.params.key;
    try {
        const reply = await redisClient.get(key);
        res.send(reply ? reply : { msg: 'Not Found' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
