require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

const corsOptions = {
    origin: 'https://tuf-frontend-wine.vercel.app', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        ca : fs.readFileSync(path.resolve(__dirname, 'DigiCertGlobalRootCA.crt.pem')),
    },
    connectTimeout: 10000,
});

db.connect((err) => {
    if(err){
        console.log("Error connecting to the database: ", err.stack);
        process.exit(1);
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

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
