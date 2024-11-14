const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '53907030', // Replace with your actual password
  database: 'product_management',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create 'uploads' directory if it doesn't exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Create unique filenames using timestamp
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPG, PNG, and JPEG are allowed.'));
    }
    cb(null, true);
  },
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product Management API! Use /api/products for product operations.');
});

// API to get all products
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Error retrieving products' });
    }
    console.log('Fetched products:', results); // Debugging log
    res.json(results);
  });
});

// API to add a new product
app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, description, category_name, price, quantity } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Handle image if present

  // Validate required fields
  if (!name || !price || quantity === undefined) {
    return res.status(400).json({ message: 'Name, price, and quantity are required' });
  }

  const query = 'INSERT INTO products (name, description, category_name, price, quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [name, description, category_name, parseFloat(price), parseInt(quantity), imageUrl];

  // Log the data being inserted for debugging
  console.log('Inserting product with values:', values);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error adding product:', err); // Log error details
      return res.status(500).json({ message: 'Error adding product', error: err.message }); // Include error message
    }
    res.status(201).json({
      id: result.insertId,
      name,
      description,
      category_name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      image_url: imageUrl,
    });
  });
});

// API to update a product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category_name, price, quantity } = req.body;

  if (!name || !price || quantity === undefined) {
    return res.status(400).json({ message: 'Name, price, and quantity are required' });
  }

  const query = 'UPDATE products SET name = ?, description = ?, category_name = ?, price = ?, quantity = ? WHERE product_id = ?';
  const values = [name, description, category_name, parseFloat(price), parseInt(quantity), id];

  db.query(query, values, (err) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ message: 'Error updating product' });
    }
    res.json({ id, name, description, category_name, price: parseFloat(price), quantity: parseInt(quantity) });
  });
});

// API to delete a product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM products WHERE product_id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Error deleting product' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// API to update product quantity
app.patch('/api/products/:id', (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;

  if (quantity === undefined) {
    return res.status(400).json({ message: 'Quantity is required' });
  }

  db.query('UPDATE products SET quantity = ? WHERE product_id = ?', [parseInt(quantity), id], (err, result) => {
    if (err) {
      console.error('Error updating product quantity:', err);
      return res.status(500).json({ message: 'Error updating product quantity' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product quantity updated successfully' });
  });
});

// API to get all users
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Error retrieving users' });
    }
    res.json(results);
  });
});

// API to add a new user
app.post('/api/users', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  db.query('INSERT INTO users (username) VALUES (?)', [username], (err, result) => {
    if (err) {
      console.error('Error adding user:', err);
      return res.status(500).json({ message: 'Error adding user' });
    }
    res.status(201).json({ id: result.insertId, username });
  });
});

// API to update a user
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  db.query('UPDATE users SET username = ? WHERE user_id = ?', [username, id], (err) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Error updating user' });
    }
    res.json({ id, username });
  });
});

// API to delete a user
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM users WHERE user_id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Error deleting user' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// API to update product picture
app.post('/api/products/:id/picture', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Handle image if present

  if (!imageUrl) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  const query = 'UPDATE products SET image_url = ? WHERE product_id = ?';
  db.query(query, [imageUrl, id], (err) => {
    if (err) {
      console.error('Error updating product image:', err);
      return res.status(500).json({ message: 'Error updating product image' });
    }
    res.json({ message: 'Product image updated successfully', imageUrl });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something broke!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});