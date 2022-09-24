const { client } = require('./client');
const { createAddress } = require("./models/address");
const { createAddressItem } = require("./models/addressItem");
const { createItem } = require("./models/item");
const { createOrder } = require("./models/order");
const { createOrderItem } = require("./models/orderItem");
const { createReview } = require("./models/review");
const { createUser } = require("./models/user");


async function dropTables() {
    try {
        console.log("Dropping ALL Tables...");
        await client.query(`
        DROP TABLE IF EXISTS reviews;
        DROP TABLE IF EXISTS orderItems;
        DROP TABLE IF EXISTS items;
        DROP TABLE IF EXISTS addresses;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS addressItems;
        DROP TABLE IF EXISTS users;
        `);
        console.log("\nFinished dropping tables.");
    } catch (error) {
        console.log("\nError with dropping tables!");
        throw (error);
    }
}

async function buildTables() {
    try {
        console.log("\nCreating Tables...");
        await client.query(`CREATE TABLE addressItems(
            id SERIAL PRIMARY KEY,
            street varchar(255) NOT NULL,
            city varchar(255) NOT NULL,
            state varchar(255) NOT NULL,
            zipCode varchar(255) NOT NULL,
            country varchar(255) NOT NULL
        )`);

        await client.query(`CREATE TABLE items(
            id SERIAL PRIMARY KEY,
            name varchar(255) UNIQUE NOT NULL,
            description varchar(255) NOT NULL,
            price DECIMAL(12,2) NOT NULL CHECK (price>0.00),
            amount INTEGER NOT NULL CHECK (amount >=0),
            category varchar(255) NOT NULL,
            picture varchar(255) NOT NULL
            )`);

        await client.query(`CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            firstName varchar(255) NOT NULL,
            lastName varchar(255) NOT NULL,
            password varchar(255) NOT NULL,
            email varchar(255) UNIQUE NOT NULL,
            contactNumber varchar(255),
            type varchar(255) NOT NULL
            )`);

        await client.query(`CREATE TABLE addresses(
            id SERIAL PRIMARY KEY,
            "userId" INTEGER REFERENCES users(id),
            "addressItemId" INTEGER REFERENCES addressItems(id),
            isDefault boolean DEFAULT false,
            UNIQUE ("userId","addressItemId")
        )`);

        await client.query(`CREATE TABLE orders(
            id SERIAL PRIMARY KEY,
            "userId" INTEGER REFERENCES users(id),
            "addressId" INTEGER REFERENCES addressItems(id),
            active boolean DEFAULT false,
            UNIQUE ("userId","addressId")
        )`);

        await client.query(`CREATE TABLE orderItems(
            id SERIAL PRIMARY KEY,
            "orderId" INTEGER REFERENCES orders(id),
            "itemId" INTEGER REFERENCES items(id),
            price DECIMAL(13,2) NOT NULL CHECK (price>0.00),
            quantity INTEGER NOT NULL,
            UNIQUE ("orderId", "itemId")
            )`);

        await client.query(`CREATE TABLE reviews(
            id SERIAL PRIMARY KEY,
            "userId" INTEGER REFERENCES users(id),
            "itemId" INTEGER REFERENCES items(id),
            description varchar(256),
            UNIQUE ("userId", "itemId")
            )`);
        console.log("\nFinished creating tables.");
    } catch (error) {
        console.log("\nEror with building tables!");
        throw error;
    }
}

async function populateInitialData() {
    try {
        console.log("\nPopulating data...");
        admin = await createUser({ firstName: "Konrad", lastName: "Budny", password: "obornik1!", email: "kbudny492@gmail.com", contactNumber: "7824982486", type: "admin" });
        const item = await createItem({ name: "1969 Dodge Challenger R/T", description: "An iconic classic car", price: 169.99, amount: 10, category: "Cars", picture: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/1970_Dodge_Challenger_RT_440_Magnum_%2813440447413%29.jpg/280px-1970_Dodge_Challenger_RT_440_Magnum_%2813440447413%29.jpg" });
        const adminAddressItem = await createAddressItem({ street: "8940 E Summerdale St. Apt.4", city: "Chicago", state: "IL", zipCode: "30402", country: "US" });
        const adminAddress = await createAddress({ userId: admin.id, addressItemId: adminAddressItem.id });
        const adminOrder = await createOrder(admin.id, adminAddressItem.id);
        const orderItem = await createOrderItem({ orderId: adminOrder.id, itemId: item.id, price: 339.98, quantity: 2 });
        const review = await createReview({ userId: admin.id, itemId: item.id, description: "Great product" });
        console.log("\nFinished populating data");
    } catch (error) {
        throw error;
    }
}

async function rebuildTables() {
    try {
        client.connect();
        await dropTables();
        await buildTables();
        await populateInitialData();
    } catch (error) {
        throw error
    }
}

rebuildTables().finally(() => client.end());