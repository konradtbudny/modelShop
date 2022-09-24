const express = require("express");
const addressRouter = express.Router();
const { createAddress, deleteAddress, getAddressByUserId, getAddressById } = require("../db");
const { requireUser } = require("./utils");

addressRouter.post("/createAddress", requireUser, async (req, res, next) => {
    try {
        let userId = req.user.id;
        let { addressItemId } = req.body;
        const address = await createAddress({ userId, addressItemId });
        if (address) {
            res.send(address);
        } else {
            next({ name: "CreatingAddressError", message: "Could not create address. Check user and addressItem." });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }

});

addressRouter.get("/:userId/addresses", requireUser, async (req, res, next) => {
    let userId = req.params.userId;
    try {
        let addresses = await getAddressByUserId(userId);
        if (addresses) {
            res.send(addresses);
        } else {
            next({ name: "GettingUserAddressesError", message: "Cannot get addresses for a given user. Check if you are logged in." });
        }
    } catch ({ name, error }) {
        next({ name, message });
    }
});

addressRouter.get("/:id", async (req, res, next) => {
    let id = req.params.id;
    try {
        let address = await getAddressById(id);
        if (address) {
            res.send(address);
        } else {
            next({ name: "GettingAddressError", message: "Cannot retrieve the address. Either information is incorrect, or the address does not exists." });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
    l
});

addressRouter.delete("/:id/delete", requireUser, async (req, res, next) => {
    let id = req.params.id;
    try {
        let deletedAddress = await deleteAddress(id);
        if (deletedAddress) {
            res.send(deletedAddress);
        } else {
            next({ name: "DeletingAddressError", message: "Cannot delete the address. Check if information is correct" });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

module.exports = addressRouter;