const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3500;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sagar@156',
  database: 'photo',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
    createTable();
  }
});

function createTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      short_description VARCHAR(255),
      long_description TEXT,
      category VARCHAR(255),
      image BLOB
    )
  `;


  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('MySQL CREATE TABLE error:', err);
    } else {
      console.log('Table "products" created successfully');
      startServer();
    }
  });
}

function startServer() {
    app.use(express.static('public'));
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
  

  app.post('/api/product', (req, res) => {
    const { pname, price, sdesc, ldesc, category, image } = req.body;

    const sql = `
      INSERT INTO products (product_name, price, short_description, long_description, category, image) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [pname, price, sdesc, ldesc, category, image], (err, result) => {
      if (err) {
        console.error('MySQL INSERT error:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(201).send('Product added successfully');
      }
    });
  });


  app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products';
   
    db.query(sql, (err, result) => {
      if (err) {
        console.error('MySQL SELECT error:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(result);
      }
    });
  });
  

  app.put('/api/product/:id', (req, res) => {
    const productId = req.params.id;
    const { pname, price, sdesc, ldesc, category, image } = req.body;

    const sql = `
      UPDATE products 
      SET product_name=?, price=?, short_description=?, long_description=?, category=?, image=? 
      WHERE id=?
    `;

    db.query(sql, [pname, price, sdesc, ldesc, category, image, productId], (err, result) => {
      if (err) {
        console.error('MySQL UPDATE error:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).send('Product updated successfully');
      }
    });
  });

 
  app.delete('/api/product/:id', (req, res) => {
    const productId = req.params.id;

    const sql = 'DELETE FROM products WHERE id=?';

    db.query(sql, [productId], (err, result) => {
      if (err) {
        console.error('MySQL DELETE error:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).send('Product deleted successfully');
      }
    });
  });

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS deliverydetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    cname VARCHAR(255),
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    tel VARCHAR(20) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    orderNote TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.query(createTableQuery, (error, results) => {
  if (error) {
    console.error('Error creating table:', error);
  } else {
    console.log('Table created successfully:', results);
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/checkout', (req, res) => {
  const formData = req.body;


  const insertQuery = `
    INSERT INTO deliverydetails (fname, lname, cname, country, city, address, email, password, tel, mobile, orderNote)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  
  db.query(
    insertQuery,
    [
      formData.fname,
      formData.lname,
      formData.cname,
      formData.country,
      formData.cityy,
      formData.address,
      formData.email,
      formData.password,
      formData.tel,
      formData.mobile,
      formData.orderNote,
    ],
    (error, results) => {
      if (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Data inserted successfully:', results);
        res.send('Data inserted successfully!');
      }
    }
  );
});


app.get('/fetchOrders', (req, res) => {
    const fetchOrdersQuery = 'SELECT * FROM orders';
  
    db.query(fetchOrdersQuery, (error, results) => {
      if (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
