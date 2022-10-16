const express = require("express");
const { requireUser } = require("./utils");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { createUser, getUserByEmail, getUserById, updateUser, deleteUser } = require("../db");
require("dotenv").config()

userRouter.use((req, res, next) => {
    console.log("A request is made to /user");
    next();
});

userRouter.post("/register/", async (req, res, next) => {
    const { firstName, lastName, password, email, contactNumber } = req.body;
    try {
        const _user = await getUserByEmail(email);
        if (_user) {
            next({ name: "UserExistsError", message: "An user exists with the given email" });
        } else {
            const user = await createUser({ firstName, lastName, password, email, contactNumber, type: "basic" });
            if (user) {
                const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1w" });
                res.send({ user, message: "you are signed up", token });
            } else {
                next({ name: "UserCreationError", message: "There was a problem with user registration. Please try again." });
            }
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

userRouter.post("/login/", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        next({ name: "MissingCredentialError", message: "Please Supply both email and password" });
    }
    try {
        const user = await getUserByEmail(email);
        const comparePassword = await bcrypt.compare(password, user.password);
        if (user && comparePassword) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            
            res.send({ user, message: "You are logged in", token });
        }
        else {
            next({ name: "IncorrectCredentialsError", message: "Username or password is incorrect" });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

userRouter.get("/me/", requireUser, async (req, res, next) => {
    try {
        const user = await getUserByEmail(req.body.email);
        if (user) {
            res.send(user);
        } else {
            next({ name: "NoUserError", message: "There is no user with such id." })
        }

    } catch ({ name, message }) {
        next({ name, message });
    }
});

userRouter.patch("/:userId/update", requireUser, async (req, res, next) => {
    const { type, contactNumber } = req.body;
    try {
        const user = await getUserById(req.params.userId);
        if (user && user.id === req.user.id) {
            type = type ? type : user.type;
            contactNumber = contactNumber ? contactNumber : user.contactNumber;
            const updatedUser = await updateUser(user.id, { type, contactNumber });
            res.send({ user: updatedUser });
        } else {
            next(user ? { name: "UnauthorizedUserError", message: "You cannot update an account that is not yours!" } : { name: "UserNotFoundError", message: "The user does not exist" });
        }
    } catch ({ name, message }) {
        name({ name, message });
    }
});

userRouter.delete("/:userId/delete", requireUser, async (req, res, next) => {
    try {
        const user = await getUserById(req.params.userId);
        if (user && user.id === req.user.id) {
            const deletedUser = await deleteUser(user.firstName, user.lastName, user.email);
            res.send(deletedUser);
        } else {
            next(user ? { name: "UnauthorizedUserError", message: "You cannot delete an account that is not yours!" } : { name: "UserNotFoundError", message: "The user does not exist" });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

module.exports = userRouter;