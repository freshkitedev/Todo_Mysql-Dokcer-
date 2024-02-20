import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    database: process.env.MYSQL_DB || 'mysql',
    password: process.env.MYSQL_PASS || 'freshkite',
    port: process.env.MYSQL_PORT || 3310,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('Connected to MySQL DB');

app.listen(process.env.PORT || 5000, async () => {
    try {
        console.log("Server is running on port number 5000");
    } catch (err) {
        console.error("Error while starting the server", err);
    }
});

app.post("/todo", async (req, res) => {
    const data = { title: req.body.title, description: req.body.description };

    try {
        const connection = await pool.getConnection();
        await connection.query("INSERT INTO todocollection SET ?", data);
        connection.release();
        console.log("Successfully created");
        res.status(200).json({ success: true, message: "Successfully created" });
    } catch (err) {
        console.error("Error while creating data", err);
        res.status(500).json({ error: "Error creating data", details: err.message });
    }
});

app.get("/todo", async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM todocollection');
        const todos = rows.map(row => ({ id: row.id, title: row.title, description: row.description }));
        console.log("Data", todos);
        res.status(200).json(todos);
    } catch (err) {
        console.error("Error while getting data", err);
        res.status(500).json({ error: "Error getting data", details: err.message });
    }
});

app.delete("/todo/:id", async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM todocollection WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Record not found" });
        } else {
            res.status(200).json({ success: true, message: "Successfully deleted" });
        }
    } catch (err) {
        console.error("Error while deleting data", err);
        res.status(500).json({ error: "Error deleting data", details: err.message });
    }
});

app.put("/todo/:id", async (req, res) => {
    try {
        const data = { title: req.body.title, description: req.body.description };
        const [result] = await pool.query("UPDATE todocollection SET ? WHERE id = ?", [data, req.params.id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Record not found" });
        } else {
            res.status(200).json({ success: true, message: "Successfully updated" });
        }
    } catch (err) {
        console.error("Error while updating data", err);
        res.status(500).json({ error: "Error updating data", details: err.message });
    }
});
