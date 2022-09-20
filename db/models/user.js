const { client } = require('../client');
const bcrypt = require("bcrypt");
const { getAddressById } = require("./address");

function removePassword(user) {
    delete user.password;
    delete user.hashedPassword;
    return user;
}

async function createUser({ firstName, lastName, password, email, contactNumber, type }) {
    try {
        const SALT_COUNT = 10;
        const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
        const { rows: [user] } = await client.query(`
        INSERT INTO users(firstName, lastName,password,email,contactNumber,type, addressId)
        VALUES($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (firstName, lastName) DO NOTHING
        RETURNING *;`, [firstName, lastName, hashedPassword, email, contactNumber, type]);
        user = removePassword(user);
        return user;
    } catch (error) {
        throw error;
    }
}

async function getUserByName({ firstName, lastName }) {
    try {
        const { rows: [user] } = await client.query(`
        SELECT * FROM users 
        WHERE firstName=$1 AND lastName=$2
        RETURNING *;`, [firstName, lastName]);
        if (!user) {
            return null;
        }
        user = removePassword(user);
        return user;
    } catch (error) {
        throw error;
    }
}

async function getUserById(id) {
    try {
        const { rows: [user] } = await client.query(`'
        SELECT * FROM users 
        WHERE ID=$1
        RETURNING *;`, [id]);
        user = removePassword(user);
        return user;
    } catch (error) {
        throw error;
    }
}

async function getUser({ firstName, lastName, password }) {
    try {
        let user = await getUserByName(firstName, lastName);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            user = removePassword(user);
            return user;
        }
        else {
            return;
        }
    } catch (error) {
        throw error;
    }
}

async function getAllUsers() {
    try {
        const { rows: [user] } = await client.query(`
        SELECT * FROM users
        RETURNING *;`)
        user = removePassword(user);
        return user;
    } catch (error) {
        throw error;
    }
}

async function deleteUser({ firstName, lastName, email }) {
    try {
        const { rows: [user] } = await client.query(`
        DELETE FROM users 
        WHERE firstName=$1 AND lastName=$2 AND email=$3
        RETURNING *`, [firstName, lastName, email]);
        return user;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
    getUserByName,
    getUserById,
    getUser,
    getAllUsers,
    deleteUser
};