require('dotenv').config();
const { Client } = require('pg');

let db;

module.exports = {
    getDb
};

function getDb() {
    if (db)
        return db;
    db = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });

    db.connect();
    return db;
}