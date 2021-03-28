const express = require("express");
// import cors from "cors";
const cors = require("cors");
const mysql = require('mysql2');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 8000;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  waitForConnections: true,
  connectionLimit: 5
});

const app = express();
app.use(cors());

app.get('/categories', async (req, res) => {
    let rows = []
    try {
        const connection = await pool.promise().getConnection();
        const [rows,] = await connection.query('SELECT * FROM categories');
        connection.release();
        res.status(200).send(rows)
    } catch {
        console.log('cant reach to categories db')
        res.status(500).send();
    }
});

app.get('/', (req,res) => {
    res.status(200).send('ok');
});

app.listen(PORT, () => {
  console.log(process.env.NODE_ENV)
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
