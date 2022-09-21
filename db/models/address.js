const { client } = require("../client");

async function createAddress({ userId, addressItemId }) {
    try {
        const { rows: [address] } = await client.query(`
        INSERT INTO addresses("userId","addressItemId")
        VALUES($1,$2)
        RETURNING *;`, [userId, addressItemId]);
        return address;
    } catch (error) {
        throw error;
    }
}

async function getAddressById(id) {
    try {
        const { rows: [address] } = await client.query(`
        SELECT * FROM addresses
        WHERE id=$1
        RETURNING *;`, [id]);
        return address;
    } catch (error) {
        throw error
    }
}

async function getAddressByUserId(userId) {
    try {
        const { rows: [address] } = await client.query(`
        SELECT * FROM addresses
        WHERE "userId"=$1
        RETURNING *;`, [userId]);
        return address;
    } catch (error) {
        throw error
    }
}

async function deleteAddress(addressItemId, userId) {
    try {
        const { rows: [address] } = await client.query(`
        DELETE * FROM addresses
        WHERE "addressItemId"=$1 AND "userId"=$2
        RETURNING *;`, [addressItemId, userId]);
        return address;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createAddress,
    getAddressById,
    getAddressByUserId,
    deleteAddress
}