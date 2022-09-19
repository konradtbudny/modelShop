const { client } = require("../client");

async function createAddress({ userId, addressItemId, isDefault }) {
    try {
        const { rows: [address] } = await client.query(`
        INSERT INTO addresses("userId","addressItemId",isDefault)
        VALUES($1,$2,$3,$4,$5)
        ON CONFLICT ("userId,"addressItemId") DO NOTHING
        RETURNING *;`, [userId, addressItemId, isDefault]);
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