const axios = require('axios');
const { performance } = require('perf_hooks');
const { createCanvas } = require('canvas');
const fs = require('fs');

const redisUrl = 'http://localhost:3000/redis';
const mongoUrl = 'http://localhost:3000/mon';
const postgresUrl = 'http://localhost:3000/pgroute';

// const testData = { key: 'testKey', value: 'testValue' };
const iterations = 100000;  // Number of iterations for benchmarking


const getRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const benchmark = async () => {
    const testData = { key: getRandomString(10), value: getRandomString(20) };
    // Warm-up phase
    await axios.post(`${redisUrl}/set`, testData);
    await axios.get(`${redisUrl}/get/testKey`);
    await axios.post(`${mongoUrl}/set`, testData);
    await axios.get(`${mongoUrl}/get/testKey`);
    await axios.post(`${postgresUrl}/set`, testData);
    await axios.get(`${postgresUrl}/get/testKey`);

    // Benchmarking phase
    let redisSetTime = 0;
    let redisGetTime = 0;
    let mongoSetTime = 0;
    let mongoGetTime = 0;
    let postgresSetTime = 0;
    let postgresGetTime = 0;

    for (let i = 0; i < iterations; i++) {
        const testData = { key: getRandomString(10), value: getRandomString(20) };
        let start, end;

        // Redis SET
        start = performance.now();
        await axios.post(`${redisUrl}/set`, testData);
        end = performance.now();
        redisSetTime += (end - start);

        // Redis GET
        start = performance.now();
        await axios.get(`${redisUrl}/get/testKey`);
        end = performance.now();
        redisGetTime += (end - start);

        // MongoDB SET
        start = performance.now();
        await axios.post(`${mongoUrl}/set`, testData);
        end = performance.now();
        mongoSetTime += (end - start);

        // MongoDB GET
        start = performance.now();
        await axios.get(`${mongoUrl}/get/testKey`);
        end = performance.now();
        mongoGetTime += (end - start);

        // PostgreSQL SET
        start = performance.now();
        await axios.post(`${postgresUrl}/set`, testData);
        end = performance.now();
        postgresSetTime += (end - start);

        // PostgreSQL GET
        start = performance.now();
        await axios.get(`${postgresUrl}/get/testKey`);
        end = performance.now();
        postgresGetTime += (end - start);
    }

    const redisSetAvg = redisSetTime / iterations;
    const redisGetAvg = redisGetTime / iterations;
    const mongoSetAvg = mongoSetTime / iterations;
    const mongoGetAvg = mongoGetTime / iterations;
    const postgresSetAvg = postgresSetTime / iterations;
    const postgresGetAvg = postgresGetTime / iterations;

    console.log(`Average Redis SET: ${redisSetAvg} ms`);
    console.log(`Average Redis GET: ${redisGetAvg} ms`);
    console.log(`Average MongoDB SET: ${mongoSetAvg} ms`);
    console.log(`Average MongoDB GET: ${mongoGetAvg} ms`);
    console.log(`Average PostgreSQL SET: ${postgresSetAvg} ms`);
    console.log(`Average PostgreSQL GET: ${postgresGetAvg} ms`);

    // Calculate percentage differences
    const redisSetPercentage = 100; // Base
    const redisGetPercentage = 100; // Base

    const mongoSetPercentage = (mongoSetAvg / redisSetAvg) * 100;
    const mongoGetPercentage = (mongoGetAvg / redisGetAvg) * 100;

    const postgresSetPercentage = (postgresSetAvg / redisSetAvg) * 100;
    const postgresGetPercentage = (postgresGetAvg / redisGetAvg) * 100;

    console.log(`MongoDB SET is ${mongoSetPercentage.toFixed(2)}% of Redis SET`);
    console.log(`MongoDB GET is ${mongoGetPercentage.toFixed(2)}% of Redis GET`);
    console.log(`PostgreSQL SET is ${postgresSetPercentage.toFixed(2)}% of Redis SET`);
    console.log(`PostgreSQL GET is ${postgresGetPercentage.toFixed(2)}% of Redis GET`);

    // Generate the graph
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Benchmark Results by Database and Operation', 150, 30);

    // Labels
    const labels = ['SET', 'GET'];
    const redisMeans = [redisSetAvg, redisGetAvg];
    const mongoMeans = [mongoSetAvg, mongoGetAvg];
    const postgresMeans = [postgresSetAvg, postgresGetAvg];

    // Data
    const data = {
        labels,
        datasets: [
            { label: 'Redis', data: redisMeans, backgroundColor: '#ff6384' },
            { label: 'MongoDB', data: mongoMeans, backgroundColor: '#36a2eb' },
            { label: 'PostgreSQL', data: postgresMeans, backgroundColor: '#cc65fe' },
        ],
    };

    // Bar chart
    const barWidth = 50;
    const barSpacing = 50;
    const baseX = 100;
    const baseY = 300;

    data.datasets.forEach((dataset, index) => {
        ctx.fillStyle = dataset.backgroundColor;
        dataset.data.forEach((value, i) => {
            const x = baseX + i * (barWidth + barSpacing) + index * barWidth;
            const y = baseY - value;
            ctx.fillRect(x, y, barWidth, value);
            ctx.fillText(value.toFixed(2), x, y - 10);
        });
    });

    // Save the graph
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('benchmark_results.png', buffer);
    console.log('Graph saved as benchmark_results.png');
};

benchmark();
