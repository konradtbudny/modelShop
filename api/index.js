const apiRouter = require('express').Router();
require('dotenv').config()

apiRouter.get('/', (req, res, next) => {
    res.send({
        message: 'API is under construction!',
    });
});

apiRouter.get('/health', (req, res, next) => {
    res.send({
        healthy: true,
    });
});

module.exports = apiRouter;