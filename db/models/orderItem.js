const { client } = require("../client");

async function createOrderItem({ orderId, itemId, price, quantity }) {
    try {
        const { rows: [orderItem] } = await client.query(`
        INSERT INTO orderItems("orderId","itemId",price,quantity)
        VALUES($1,$2,$3,$4)
        ON CONFLICT ("orderId","itemId") DO NOTHING
        RETURNING *;`, [orderId, itemId, price, quantity]);
        return orderItem;
    } catch (error) {
        throw error;
    }
}

async function getAllOrderItems() {
    try {
        const { rows: [orderItems] } = await client.query(`
        SELECT * FROM orderItems
        RETURNING *;`);
        return orderItems;
    } catch (error) {
        throw error;
    }
}

async function getOrderItemById(id) {
    try {
        const { rows: [orderItem] } = await client.query(`
        SELECT * FROM orderItems
        WHERE id=$1
        RETURNING *;`, [id]);
        return orderItem;
    } catch (error) {
        throw error;
    }
}

async function getOrderItemsByOrderId(orderId) {
    try {
        const { rows: [orderItem] } = await client.query(`
        SELECT * FROM orderItems
        WHERE "orderId"=$1
        RETURNING *;`, [orderId]);
        return orderItem;
    } catch (error) {
        throw error;
    }
}

async function updateOrderItem({ id, price, quantity }) {
    try {
        let temp = await getOrderItemById(id);
        price = price ? price : temp.price;
        quantity = quantity ? quantity : temp.quantity;
        const { rows: [orderItem] } = await client.query(`
        UPDATE orderitems
        SET price=$1, quantity=$2
        WHERE id=$3
        RETURNING *;`, [price, quantity, id]);
        return orderItem;
    } catch (error) {
        throw error;
    }
}

async function deleteOrderItem(id) {
    try {
        const { rows: [orderItem] } = await client.query(`
        DELETE FROM orderItems
        WHERE id=$1
        RETURNING *;`, [id]);
        return orderItem;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createOrderItem,
    getAllOrderItems,
    getOrderItemById,
    getOrderItemsByOrderId,
    updateOrderItem,
    deleteOrderItem
}