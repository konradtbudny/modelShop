const express = require('express');
const server = express();

const cors = require('cors');
server.use(cors());

const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.json());

const path = require('path');
server.use(express.static(path.join(__dirname, 'build')));

server.use('/api', require('./api'));

server.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const { client } = require('./db/client');
const PORT = process.env.PORT || 4000;

const handle = server.listen(PORT, async () => {
    console.log(`Server is running on ${PORT}!`);

    try {
        client.connect();
        console.log('Database is open for business!');
    } catch (error) {
        console.error('Database is closed for repairs!\n', error);
    }
});

module.exports = {
    server,
    handle
};
