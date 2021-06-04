"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = require('body-parser');
const cors_1 = __importDefault(require("cors"));
const mysql = require('mysql2');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    waitForConnections: true,
    connectionLimit: 5
});
const app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
const PORT = 8000;
app.get('/healthz', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('healthz check');
    res.status(200).send({ response: "success" });
}));
app.get('/categories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('request for categories');
    const connection = yield pool.promise().getConnection();
    const [rows,] = yield connection.query('SELECT * FROM categories');
    connection.release();
    res.status(200).send(rows);
}));
app.post('/categories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield pool.promise().getConnection();
        yield connection.query(`INSERT INTO categories (name) VALUES ('${req.body.name}')`);
        connection.release();
        res.send();
    }
    catch (e) {
        console.log('cant reach to categories db');
        console.log(e);
        res.status(500).send();
    }
}));
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
