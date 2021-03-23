import express, {Request, Response} from 'express';
const mysql = require('mysql2');

import ShortUniqueId from 'short-unique-id';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const pool = mysql.createPool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USERNAME,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DBNAME,
  waitForConnections: true,
  connectionLimit: 5
});

const app = express();
const PORT = 8000;
app.get('/categories', async (req: Request, res: Response) => {
  const connection = await pool.promise().getConnection();
  const [rows, ] = await connection.query('SELECT * FROM categories');
  connection.release();

  res.status(200).send(rows)
});
app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});