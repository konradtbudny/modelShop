const express = require("express");
const orderRouter = express.Router();
const { getOrderById, getOrderByUserId, deleteOrder } = require("../db");
const { requireUser } = require("./utils");

orderRouter.get("/:id", requireUser, async (req, res, next) => {
    try {
        const order = await getOrderById(req.params.id);
        if (order) {
            res.send(order);
        } else {
            next({ name: "MissingOrderError", message: "There is no such order." });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

orderRouter.get("/history", requireUser, async (req, res, next) => {
    try {
        let userId = req.user.id;
        const allOrders = await getOrderByUserId(userId);
        if (allOrders) {
            res.send(allOrders);
        } else {
            next({ name: "GettingUserOrdersError", message: "Cannot get orders for a given user. Check if you are logged in." });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

orderRouter.delete("/:id/delete", requireUser, async (req, res, next) => {
    let id = req.params.id;
    try {
        let deletedOrder = await deleteOrder(id);
        if (deletedOrder) {
            res.send(deleteOrder);
        } else {
            next({ name: "DeletingOrderItemError", message: "Cannot delete order. Either the order does not exists or you are not logged in." });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

module.exports = orderRouter;