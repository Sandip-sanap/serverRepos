const { Pool } = require('pg'); 

const pool = new Pool({
  user: 'your_username', // Replace with your PostgreSQL username
  host: 'localhost', // Replace with your PostgreSQL host
  database: 'your_database_name', // Replace with your database name
  password: 'your_password', // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};