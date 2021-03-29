const express = require("express");
var bodyParser = require('body-parser')
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
app.use(express.json())
app.use(cors());

app.get('/categories', async (req, res) => {
    let rows = []
    try {
        const connection = await pool.promise().getConnection();
        const [rows,] = await connection.query('SELECT * FROM categories');
        connection.release();
        res.status(200).send(rows)
    } catch(e) {
        console.log(e);
        console.log('cant reach to categories db')
        res.status(500).send();
    }
});

app.post('/categories', async (req, res) => {
  try {
      const connection = await pool.promise().getConnection();
      await connection.query(`INSERT INTO categories (name) VALUES ('${req.body.name}')`);
      connection.release();
      res.send()
  } catch(e) {
      console.log(e);
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
