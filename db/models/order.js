const { client } = require("../client");

async function createOrder(userId, addressId) {
    try {
        const { rows: [order] } = await client.query(`
        INSERT INTO orders("userId","addressId")
        VALUES($1,$2)
        RETURNING *;`, [userId, addressId]);
        return order;
    } catch (error) {
        throw error;
    }
}

async function getAllOrders() {
    try {
        const { rows: [orders] } = await client.query(`
        SELECT * FROM orders
        RETURNING *;`);
        return orders;
    } catch (error) {
        throw error;
    }
}

async function getOrderById(id) {
    try {
        const { rows: [order] } = await client.query(`
        SELECT * FROM orders
        WHERE id=$1
        RETURNING *;`, [id]);
        return order;
    } catch (error) {
        throw error;
    }
}

async function getOrderByUserId(userId) {
    try {
        const { rows: [order] } = await client.query(`
        SELECT * FROM orders
        WHERE "userId"=$1
        RETURNING *;`, [userId]);
        return order;
    } catch (error) {
        throw error;
    }
}

async function updateOrder({ id, addressId, active }) {
    try {
        let temp = await getOrderById(id);
        addressId = addressId ? addressId : temp.addressId;
        active = active ? active : temp.active;
        const { rows: [order] } = await client.query(`
        UPDATE orders
        SET "addressId"=$1, active=$2
        WHERE id=$3
        RETURNING *;`, [addressId, active, id])
    } catch (error) {
        throw error;
    }
}

async function deleteOrder(id) {
    try {
        const { rows: [order] } = await client.query(`
        DELETE FROM orders
        WHERE id=$1
        RETURNING *`, [id]);
        return order;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    getOrderByUserId,
    updateOrder,
    deleteOrder
}