const express = require('express');
const router = express.Router();
const Data = require('../models/data.model');

router.post('/set', async (req, res) => {
    console.log('Mongo Data received', req.body);
    const { key, value } = req.body;
    try {
        // Upsert: update if exists, insert if not
        const result = await Data.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.send({ msg: 'OK' });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/get/:key', async (req, res) => {
    const key = req.params.key;
    try {
        const data = await Data.findOne({ key });
        res.send(data ? data.value : { msg: 'Not Found' });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
