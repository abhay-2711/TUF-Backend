require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

db.connect((err) => {
    if(err){
        console.log("Error connecting to the database: ", err);
    }else{
        console.log("Connected to the database");
    }
});

// API to get banner data
app.get('/api/banner', (req,res) => {
    db.query('SELECT * FROM banner WHERE id = 1', (err, result) => {
        if(err){
            throw err;
        }else{
            res.send(result[0]);
        }
    });
});

// API to update banner data
app.post('/api/banner', (req,res) => {
    const { title, description, timer, link,  isVisible } = req.body;
    db.query('UPDATE banner SET title = ?, description = ?, timer = ?, link = ?, isVisible = ? WHERE id = 1',
        [title, description, timer, link, isVisible], (err, result) => {
        if(err){
            throw err;
        }else{
            res.send("Banner Updated Successfully");
        }
    });
});

// API to toggle banner visibility
app.post('/api/banner/toggle-visibility', (req, res) => {
    db.query('SELECT isVisible FROM banner WHERE id = 1', (err, result) => {
        if (err) {
            throw err;
        } else {
            const newVisibility = !result[0].isVisible;
            db.query('UPDATE banner SET isVisible = ? WHERE id = 1', [newVisibility], (err, updateResult) => {
                if (err) {
                    throw err;
                } else {
                    res.json({ isVisible: newVisibility });
                }
            });
        }
    });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

