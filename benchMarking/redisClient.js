const redis = require('redis');

const REDIS_HOST =  'localhost';
const REDIS_PORT = 6379;

const client = redis.createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`
});

client.connect()
    .then(() => {
        console.log('Connected to Redis...');
    })
    .catch((err) => {
        console.error('Redis connection error: ', err);
    });

client.on('error', (err) => {
    console.error('Redis error: ', err);
});

module.exports = client;
