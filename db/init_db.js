const { client } = require('./client');
const { createItem } = require("./models/item");
const { createUser } = require("./models/user");
const { createAddress } = require("./models/address")

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
            isDefault BOOLEAN DEFAULT false NOT NULL
        )`);

        await client.query(`CREATE TABLE orders(
            id SERIAL PRIMARY KEY,
            "userId" INTEGER REFERENCES users(id),
            "addressId" INTEGER REFERENCES addressItems(id),
            active BOOLEAN DEFAULT false
        )`);

        await client.query(`CREATE TABLE orderItems(
            id SERIAL PRIMARY KEY,
            "orderId" INTEGER REFERENCES orders(id),
            "itemId" INTEGER REFERENCES items(id),
            price INTEGER NOT NULL,
            quantity INTEGER NOT NULL
            )`);

        await client.query(`CREATE TABLE reviews(
            id SERIAL PRIMARY KEY,
            "userId" INTEGER REFERENCES users(id),
            "itemId" INTEGER REFERENCES items(id),
            description varchar(256)
            )`);
        console.log("\nFinished creating tables.");
    } catch (error) {
        console.log("\nEror with building tables!");
        throw error;
    }
}

async function rebuildTables() {
    try {
        client.connect();
        await dropTables();
        await buildTables();
        //await populateInitialData();
    } catch (error) {
        throw error
    }
}

rebuildTables().finally(() => client.end());