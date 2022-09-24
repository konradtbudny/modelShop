const express = require("express");
const itemRouter = express.Router();
const { createItem, getItemById, getAllItems, getUserById, updateItem, deleteItem } = require("../db");
const { requireUser } = require("./utils");

itemRouter.post("/createItem", requireUser, async (req, res, next) => {
    const { name, description, price, amount, category, picture } = req.body;
    try {
        const item = await createItem({ name, description, price, amount, category, picture });
        if (item) {
            res.send(item);
        } else {
            next({ name: "CreatingItemError", message: "Item was not created. Check if you provided all information." });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

itemRouter.get("/:id", async (req, res, next) => {
    let id = req.params.id;
    try {
        let item = await getItemById(id);
        if (item) {
            res.send(item);
        } else {
            next({ name: "GettingItemError", message: "Cannot fetch the item. Check request information." });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

itemRouter.get("/", async (req, res, next) => {
    try {
        let items = getAllItems();
        if (items) {
            res.send(items);
        } else {
            next({ name: "GettingItemsError", message: "Cannot retrieve all items. Check database connection." });
        }
    } catch ({ name, messge }) {
        next({ name, message });
    }
});

itemRouter.patch("/:id/update", requireUser, async (req, res, next) => {
    let user = await getUserById(req.user.id);
    try {
        if (!(user.type == "Admin")) {
            next({ name: "UserTypeError", message: "Only admin can change item properties" });
        }

        let id = req.params.id;
        let { name, description, price, amount, picture } = req.body;

        let updatedItem = await updateItem({ id, name, description, price, amount, picture });
        if (updatedItem) {
            res.send(updatedItem);
        } else {
            next({ name: "UpdatingItemError", message: "Check, if you provided correct data" });
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
});

item.patch("/:id", requireUser, async (req, res, next) => {
    let id = req.params.id;
    let { amount } = req.body;
    try {
        let updatedItem = await updateItem({ id, amount });
        if (updatedItem) {
            res.send(updatedItem);
        } else {
            next({ name: "UpdatingItemAmountError", message: "Cannot update item amount. Check provided info" });
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
});

itemRouter.delete("/:id/delete", requireUser, async (req, res, next) => {
    try {
        let user = await getUserById(req.user.id);
        if (!(user.type == "Admin")) {
            next({ name: "ItemDeleteError", message: "Only administrator can delete an item" });
        }
        let id = req.params.id
        let deletedItem = await deleteItem(id);
        if (deletedItem) {
            res.send(deletedItem);
        } else {
            next({ name: "DeletingItemError", message: "Error with item deletion. The item was not deleted" });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

module.exports = itemRouter;