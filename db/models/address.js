const { client } = require("../client");

async function createAddress({ street, city, state, zipCode, country }) {
    try {
        const { rows: [address] } = await client.query(`
        INSERT INTO addresses(street, city,state,zipCode,country)
        VALUES($1,$2,$3,$4,$5)
        RETURNING *;
        `, [street, city, state, zipCode, country]);
        return address;
    } catch (error) {
        throw error;
    }
}
async function getAddressById(id) {
    try {
        const { rows: [address] } = await client.query(`SELECT * FROM addresses WHERE id=$1`, [id]);
        return address;
    } catch (error) {
        throw error
    }
}
async function deleteAddress(id) {
    try {
        const { rows: [address] } = await client.query(`DELETE * FROM addresses WHERE id=$1`, [id])
    } catch (error) {
        throw error;
    }
}
module.exports = {
    createAddress,
    getAddressById,
    deleteAddress
}