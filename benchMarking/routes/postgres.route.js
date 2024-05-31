const express = require('express');
const router = express.Router();
const pool = require('../postgresClient');

router.post('/set', async (req, res) => {
    const { key, value } = req.body;
    console.log('Req on postgres: ', req.body)
    try {
        const result = await pool.query('SELECT value FROM data WHERE key = $1', [key]);
        if (result.rows.length > 0) {
            await pool.query('UPDATE data SET value = $1 WHERE key = $2', [value, key]);
        } else {
            await pool.query('INSERT INTO data (key, value) VALUES ($1, $2)', [key, value]);
        }
        res.send({ msg: 'OK' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/get/:key', async (req, res) => {
    const key = req.params.key;
    try {
        const result = await pool.query('SELECT value FROM data WHERE key = $1', [key]);
        res.send(result.rows.length ? result.rows[0].value : { msg: 'Not Found' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
