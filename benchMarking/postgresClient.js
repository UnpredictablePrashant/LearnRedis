const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'benchmarkdb',
    password: 'postgres',
    port: 5432,
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL...');
});

pool.on('error', (err) => {
    console.error('PostgreSQL error: ', err);
});

const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS data (
            key VARCHAR(255) PRIMARY KEY,
            value TEXT NOT NULL
        );
    `;
    try {
        await pool.query(query);
        console.log('Table "data" is ready');
    } catch (err) {
        console.error('Error creating table:', err);
    }
};

createTable();

module.exports = pool;
