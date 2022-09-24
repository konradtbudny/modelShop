const express = require("express");
const orderItemRouter = express.Router();
const { createOrderItem, getOrderItemById, updateOrderItem, deleteOrderItem } = require("../db");
const { requireUser } = require("./utils");

orderItemRouter.post("/addOrder", requireUser, async (req, res, next) => {
    const { orderId, itemId, price, quantity } = req.body;
    try {
        const orderItem = await createOrderItem(orderId, itemId, price, quantity);
        if (orderItem) {
            res.send(orderItem);
        } else {
            next({ name: "CreateOrderItemError", message: "There is something wrong with creating order item." });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

orderItem.get("/:id", requireUser, async (req, res, next) => {
    const { id } = req.params;
    try {
        const orderItem = await getOrderItemById(id);
        if (orderItem) {
            res.send(orderItem);
        } else {
            next({ name: "GetOrderItemError", message: "There is no order item with such id" });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

orderItemRouter.patch("/:id/update", requireUser, async (req, res, next) => {
    const { id } = req.params;
    const { price, quantity } = req.body;
    let temp = await getOrderItemById(id);
    let data = {};
    data.id = id;
    data.price = price ? price : temp.price;
    data.quantity = quantity ? quantity : temp.quantity;
    try {
        const updated = await updateOrderItem(data);
        if (updated) {
            res.send(updated);
        } else {
            next({ name: "OrderItemUpdateError", message: "There was an error while updating order item." })
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

orderItemRouter.delete("/:id/delete", requireUser, async (req, res, next) => {
    const { id } = req.params.id;
    try {
        const order = await deleteOrderItem(id);
        if (order) {
            res.send(order);
        } else {
            next({ name: "DeleteOrderError", message: "The order with such id do not exist. The order has not been deleted." });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

module.exports = orderItemRouter;