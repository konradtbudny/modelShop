const { client } = require("../client");

async function createItem({ name, description, price, amount, category, picture }) {
    try {
        const { rows: [item] } = await client.query(`
        INSERT INTO items(name, description, price, amount,category,picture)
        VALUES($1,$2,$3,$4,$5,$6)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;`, [name, description, price, amount, category, picture]);
        return item;
    } catch (error) {
        throw error
    }
}

async function getAllItems() {
    try {
        const { rows: [item] } = await client.query(`
        SELECT * FROM items
        RETURNING *;`);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getItemById(id) {
    try {
        const { rows: [item] } = await client.query(`
        SELECT * FROM items
        WHERE id=$1;`, [id]);
        return item;
    } catch (error) {
        throw error;
    }
}

async function updateItem({ id, name, description, price, amount, picture }) {
    try {
        const temp = await getItemById(id);
        name = name ? name : temp.name;
        description = description ? description : temp.description;
        price = price ? price : temp.price;
        amount = amount ? amount : temp.amount;
        picture = picture ? picture : temp.picture;
        const { rows: [item] } = await client.query(`
        UPDATE items
        SET name=$1, description=$2, price=$3, amount=$4,picture=$5
        WHERE id=$6
        RETURNING *;`, [name, description, price, amount, picture, id]);
        return item;
    } catch (error) {
        throw error;
    }
}

async function deleteItem(id) {
    try {
        const { rows: [item] } = await client.query(`
        DELETE FROM items
        WHERE id=$1
        RETURNING *;`, [id]);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
}