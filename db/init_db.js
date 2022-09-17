const { client } = require('./client');
const { createItem } = require("./models/item");
const { createUser } = require("./models/user");

async function dropTables() {
    try {
        console.log("Dropping ALL Tables...");
        await client.query(`
        DROP TABLE IF EXISTS items;
        DROP TABLE IF EXISTS users;
        `);
        console.log("\nFinished dropping tables.");
    } catch (error) {
        console.log("\nError with dropping tables!");
        throw(error);
    }
}

async function buildTables() {
    try {
        console.log("\nCreating Tables...");
        await client.query(`CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            contactNumber varchar(255),
            type varchar(255) NOT NULL
        )`);
        await client.query(`CREATE TABLE items(
            id SERIAL PRIMARY KEY,
            name varchar(255) UNIQUE NOT NULL,
            description varchar(255) NOT NULL,
            price DECIMAL(12,2) NOT NULL CHECK (price>0.00),
            amount INTEGER CHECK (amount >=0),
            category varchar(255) NOT NULL,
            picture varchar(255)
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
        const user1 = await createUser({ username: "Kondziorek", password: "Hello World!", email: "kbudny492@gmail.com", contactNumber: "+17758426914", type: "Admin" });
        console.log("Finished users");
        const item1 = await createItem({ name: "Dodge Challanger 1969", description: "Iconinc car in scale 1:69", price: 211.43, amount: 2, category: "car", picture: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/1971_Dodge_Challenger_R-T_%285150571732%29.jpg/200px-1971_Dodge_Challenger_R-T_%285150571732%29.jpg" });
        console.log("\nFinished Populating data.")
    } catch (error) {
        console.log("\nError with populating data!")
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

rebuildTables().finally(()=>client.end());