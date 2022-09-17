const { Client } = require('pg');

const DB_NAME = 'modelsDB';

const DB_URL = process.env.DATABASE_URL || `postgres://localhost:9000/${DB_NAME}`;

let client;

if (process.env.CI) {
    client = new Client({
        host: 'localhost',
        port: 9000,
        user: 'postgres',
        password: 'postgres',
        database: 'postgres',
    });
} else {
    client = new Client(DB_URL);
}

module.exports = { client };