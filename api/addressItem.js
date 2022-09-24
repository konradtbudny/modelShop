const express = require("express");
const addressItemRouter = express.Router();
const { createAddressItem, getAddressItemById, updateAddressItem, deleteAddressItem } = require("../db");
const { requireUser } = require("./utils");

addressItemRouter.post("/createAddressItem", requireUser, async (req, res, next) => {
    const { street, city, state, zipCode, country } = req.body;
    try {
        let addressItem = await createAddressItem({ street, city, state, zipCode, country });
        if (addressItem) {
            res.send(addressItem);
        } else {
            next({ name: "CreatingAddressItemError", message: "Cannot create addressItem. Some info must be missing." });
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
});

addressItemRouter.get("/:id", requireUser, async (req, res, next) => {
    let id = req.params.id;
    try {
        const addressItem = await getAddressItemById(id);
        if (addressItem) {
            res.send(addressItem);
        } else {
            next({ name: "GettingAddressItemError", message: "Cannot get addressItem. Check id or the address does not exists." });
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
});

addressItemRouter.patch("/:id/update", requireUser, async (req, res, next) => {
    let id = req.params.id;
    let { street, city, state, zipCode, country } = req.body;
    try {
        let addressItemToUpdate = await getAddressItemById(id);
        if (!addressItemToUpdate) {
            next({ name: "GettingAddressItemError", message: "The given address does not exists." });
        }
        addressItemToUpdate.street = street ? street : addressItemToUpdate.street;
        addressItemToUpdate.city = city ? city : addressItemToUpdate.city;
        addressItemToUpdate.state = state ? state : addressItemToUpdate.state;
        addressItemToUpdate.zipCode = zipCode ? zipCode : addressItemToUpdate.zipCode;
        addressItemToUpdate.country = country ? country : addressItemToUpdate.country;
        let temp = await updateAddressItem(addressItemToUpdate);
        if (temp) {
            res.send(temp);
        } else {
            next({ name: "UpdatingAddressItemErro", message: "Some information must be missing. The given address was not updated." });
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
});

addressItemRouter.delete("/:id/delete", requireUser, async (req, res, next) => {
    let id = req.params.id;
    try {
        let temp = await deleteAddressItem(id);
        if (temp) {
            res.send(temp);
        } else {
            next({ name: "DeletinAddressItemError", message: "The given addres does not exists. Nothing changed" });
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
});

module.exports = addressItemRouter;