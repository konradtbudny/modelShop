const { client } = require('../client');
const bcrypt = require("bcrypt");
const { getAddressById } = require("./address");

function removePassword(user) {
    delete user.password;
    delete user.hashedPassword;
    return user;
}
function changeAddress(user) {
    user.address = getAddressById(user.addressId);
    delete user.addressId;
    return user;
}
async function createUser({ username, password, email, contactNumber, type, addressId }) {
    try {
        const SALT_COUNT = 10;
        const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
        const { rows: [user] } = await client.query(`
        INSERT INTO users(username,password,email,contactNumber,type, address_id)
        VALUES($1,$2,$3,$4,$5,$6)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;`, [username, hashedPassword, email, contactNumber, type, addressId]);
        user = removePassword(user);
        user = changeAddress(user);
        return user;
    } catch (error) {
        throw error;
    }
}
async function getUserByUsername(username) {
    try {
        const { rows: [user] } = await client.query(`
        SELECT * FROM users WHERE username=$1;`, [username]);
        if (!user) {
            return null;
        }
        user = removePassword(user);
        user = changeAddress(user);
        return user;
    } catch (error) {
        throw error;
    }
}
async function getUserById(id) {
    try {
        const { rows: [user] } = await client.query(`'
        SELECT * FROM users WHERE ID=$1`, [id]);
        user = removePassword(user);
        user = changeAddress(user);
        return user;
    } catch (error) {
        throw error;
    }
}
async function getUser({ username, password }) {
    try {
        let user = await getUserByUsername(username);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            user = removePassword(user);
            user = changeAddress(user);
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
        SELECT * FROM users RETURNING *;
        `)
        user = removePassword(user);
        user = changeAddress(user);
        return user;
    } catch (error) {
        throw error;
    }
}
async function deleteUser(username) {
    try {
        const { rows: [user] } = await client.query(`
        DELETE FROM users WHERE username=$1`, [username]);
        return user;
    } catch (error) {
        throw error;
    }
}
module.exports = {
    createUser,
    getUserByUsername,
    getUserById,
    getUser,
    getAllUsers,
    deleteUser
};