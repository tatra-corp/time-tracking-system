require('dotenv').config();
const { Client } = require('pg');

let db;

function getDb() {
  if (db) return db;
  db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  db.connect();
  return db;
}

module.exports = {
  getDb,
};
