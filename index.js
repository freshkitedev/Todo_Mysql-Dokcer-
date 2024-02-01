import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import 'dotenv/config';
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//creates a connection pool for MySQL database connections
export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'mysql',
    password: 'freshkite',
    port: 3307,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0 /*Specifies the maximum number of connections to queue. 
    it is  set to 0, there is no limit*/

 
    
});
console.log('connected to mysql db') ;  

 //Start the server
app.listen(5000, async () => {
    try {
        //const connection = await connect();
        // Store the database connection in app.locals to make it accessible throughout the application
        //app.locals.db = connection;

        console.log("Server is running on port number 5000");
    } catch (err) {
        console.error("Error while  starting the server", err);
    }
});
// Schema for todo
 const todoCollection = {
    title: String,
    description: String,
};


// Post method
app.post("/todo", async (req, res) => {
    const data = { title: req.body.title, description: req.body.description };

    try {
        pool.query("INSERT INTO todocollection SET ?", data, (error, result) => {

            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    // Handle duplicate entry error
                    console.log("Todo already exists");
                    res.status(400).json({ error: "Todo already exists" });
                } else {
                    // Handle other errors
                    console.error("Error while creating data", error);
                    res.status(400).json({ error: "Error creating data", details: error.message });
                }
            } else {
                console.log("Successfully created");
                res.status(200).json({ result });
            }
        });
    } catch (err) {
        console.error("Error in try-catch block", err);
        res.status(500).json({ error: "Server error" });
    }
});


// Get method
app.get("/todo", async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM todocollection');

        // Assuming 'todocollection' table has columns named 'title' and 'description'
        const todos = rows.map(row => ({ title: row.title, description: row.description }));

        console.log("Data", todos);
        res.status(200).json(todos);
    } catch (err) {
        console.error("Error while getting data", err);
        res.status(500).json({ error: "Server error" });
    }
});


// Delete method (specific delete)
app.delete("/todo/:id", async (req, res) => {
    try {
      const [result] = await pool.promise().query("DELETE FROM todocollection WHERE id = ?", [req.params.id]);
  
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Record not found" });
      } else {
        res.status(200).json({ message: "Successfully deleted" });
      }
    } catch (err) {
      console.error("Error while deleting data", err);
      res.status(400).json({ error: "Error in deleting data", details: err.message });
    }
  });
  

// Put method (specific update)
app.put("/todo/:id", async (req, res) => {
    try {
      const data = { title: req.body.title, description: req.body.description };
      const [result] = await pool.promise().query("UPDATE todocollection SET ? WHERE id = ?", [data, req.params.id]);
  
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Record not found" });
      } else {
        res.status(200).json({ id: req.params.id, ...data });
      }
    } catch (err) {
      console.error("Error while updating data", err);
      res.status(400).json({ error: "Error updating data", details: err.message });
    }
  });
  
