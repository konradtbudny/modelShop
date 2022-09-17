const {client} = require('./client');

async function buildTables() {
    try {
        client.connect();
        // drop tables in correct order

        // build tables in correct order
    } catch (error) {
        throw error;
    }
}

async function populateInitialData() {
    try {
    } catch (error) {
        throw error;
    }
}

buildTables()
    .then(populateInitialData)
    .catch(console.error)
    .finally(() => client.end());