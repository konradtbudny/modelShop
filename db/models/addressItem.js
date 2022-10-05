const { client } = require("../client");

async function createAddressItem({ street, city, state, zipCode, country }) {
    try {
        const { rows: [address] } = await client.query(`
        INSERT INTO addressItems(street, city,state,zipCode,country)
        VALUES($1,$2,$3,$4,$5)
        RETURNING *;`, [street, city, state, zipCode, country]);
        return address;
    } catch (error) {
        throw error;
    }
}

async function updateAddressItem({ street, city, state, zipCode, country,id }) {
    try {
        const { rows: [address] } = await client.query(`
        UPDATE addressItems
        SET street=$1, city=$2, state=$3,zipCode=$4,country=$5
        WHERE id=$6
        RETURNING *;`, [street, city, state, zipCode, country, id]);
        return address;
    } catch (error) {
        throw error;
    }
}

async function getAddressItemById(id) {
    try {
        const { rows: [address] } = await client.query(`
        SELECT * FROM addressItems 
        WHERE id=$1;`, [id]);
        return address;
    } catch (error) {
        throw error
    }
}

async function deleteAddressItem(id) {
    try {
        const { rows: [address] } = await client.query(`
        DELETE * FROM addressItems
        WHERE id=$1
        RETURNING *;`, [id]);
        return address;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createAddressItem,
    getAddressItemById,
    updateAddressItem,
    deleteAddressItem
}