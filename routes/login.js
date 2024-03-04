const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const cors = require('cors');


const app = express();
const port = 3300;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: 'root',
    database: 'photo',
});


const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )
`;

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }

    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table: ' + err.message);
        } else {
            console.log('Table created or already exists');
        }
    });

    console.log('Connected to the database');
});


app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(query, [email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error registering user: ' + err.message);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(201).json({ message: 'User registered successfully' });
            }
        });
    } catch (error) {
        console.error('Error hashing password: ' + error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error querying user: ' + err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (results.length === 0) {
            res.status(401).json({ error: 'Invalid email or password' });
        } else {
            const match = await bcrypt.compare(password, results[0].password);
            if (match) {
                res.status(200).json({ message: 'Login successful' });
            } else {
                res.status(401).json({ error: 'Invalid email or password' });
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
