const { Client } = require('pg');

const DB_NAME = 'kondziorek';

const DB_URL = process.env.DATABASE_URL || `postgres://localhost:5432/${DB_NAME}`;

let client;

if (process.env.CI) {
    client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'kondziorek',
        idleTimeoutMillis: 0,
        connectionTimeoutMillis: 0
    });
} else {
    client = new Client(DB_URL);
}

module.exports = { client };