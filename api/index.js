const apiRouter = require('express').Router();
require('dotenv').config()

const addressRouter = require("./address");
const addressItemRouter = require("./addressItem");
const itemRouter = require("./item");
const orderRouter = require("./order");
const orderItemRouter = require("./orderItem");
const reviewRouter = require("./review");
const userRouter = require("./user");

const jwt = require("jsonwebtoken");
const { getUserById } = require("../db");
const { JWT_SECRET } = process.env;

apiRouter.get('/health', (req, res, next) => {
    res.send({
        healthy: true,
    });
});

apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    if (!auth) {
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);
        try {
            const parsedToken = jwt.verify(token, JWT_SECRET);
            const id = parsedToken && parsedToken.id;
            if (id) {
                req.user = await getUserById(id);
                next();
            }
        } catch (error) {
            next(error);
        }
    } else {
        next({ name: "AuthorizationHeaderError", message: `Authorization token must start with ${prefix}` });
    }
});

apiRouter.use((req, res, next) => {
    if (req.user) {
        console.log("User is set: ", req.user);
    }
});

apiRouter.use("/address", addressRouter);
apiRouter.use("/addressItem", addressItemRouter);
apiRouter.use("/item", itemRouter);
apiRouter.use("/order", orderRouter);
apiRouter.use("/orderItem", orderItemRouter);
apiRouter.use("/review", reviewRouter);
apiRouter.use("/user", userRouter);

apiRouter.use((req, res, next) => {
    if (req.statusCode) {
        if (statusCode >= 100 && statusCode < 600) {
            res.status(statusCode);
        } else {
            res.status(500);
        }
        res.send({ name: error.name, message: error.message });
    }
});

module.exports = apiRouter;