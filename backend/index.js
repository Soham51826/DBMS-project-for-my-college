const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Categories API ---
app.get('/api/categories', (req, res) => {
  db.all("SELECT * FROM categories", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  db.run("INSERT INTO categories (name, description) VALUES (?, ?)", [name, description], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, description });
  });
});

// --- Suppliers API ---
app.get('/api/suppliers', (req, res) => {
  db.all("SELECT * FROM suppliers", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/suppliers', (req, res) => {
  const { name, contact_person, phone, email } = req.body;
  db.run("INSERT INTO suppliers (name, contact_person, phone, email) VALUES (?, ?, ?, ?)", [name, contact_person, phone, email], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, contact_person, phone, email });
  });
});

// --- Products API ---
app.get('/api/products', (req, res) => {
  const query = `
    SELECT p.*, c.name as category_name, s.name as supplier_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/products', (req, res) => {
  const { name, category_id, supplier_id, description, sku, price, stock_quantity, min_stock_level } = req.body;
  db.run(`
    INSERT INTO products (name, category_id, supplier_id, description, sku, price, stock_quantity, min_stock_level) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
    [name, category_id, supplier_id, description, sku, price, stock_quantity, min_stock_level], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, ...req.body });
    }
  );
});

app.put('/api/products/:id', (req, res) => {
    const { name, category_id, supplier_id, description, sku, price, stock_quantity, min_stock_level } = req.body;
    db.run(`
      UPDATE products SET 
      name = ?, category_id = ?, supplier_id = ?, description = ?, sku = ?, price = ?, stock_quantity = ?, min_stock_level = ?
      WHERE id = ?`, 
      [name, category_id, supplier_id, description, sku, price, stock_quantity, min_stock_level, req.params.id], 
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product updated successfully", changes: this.changes });
      }
    );
});

app.delete('/api/products/:id', (req, res) => {
    db.run("DELETE FROM products WHERE id = ?", req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product deleted successfully", changes: this.changes });
    });
});

// --- Transactions API ---
app.post('/api/transactions', (req, res) => {
    const { product_id, quantity, type } = req.body;
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        db.run("INSERT INTO transactions (product_id, quantity, type) VALUES (?, ?, ?)", [product_id, quantity, type]);
        
        const updateStock = type === 'IN' ? "stock_quantity + ?" : "stock_quantity - ?";
        db.run(`UPDATE products SET stock_quantity = ${updateStock} WHERE id = ?`, [quantity, product_id], function(err) {
            if (err) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: err.message });
            }
            db.run("COMMIT");
            res.json({ message: "Transaction completed successfully" });
        });
    });
});

app.get('/api/dashboard/stats', (req, res) => {
    const stats = {};
    db.get("SELECT COUNT(*) as totalProducts FROM products", (err, row) => {
        stats.totalProducts = row.totalProducts;
        db.get("SELECT COUNT(*) as lowStock FROM products WHERE stock_quantity <= min_stock_level", (err, row) => {
            stats.lowStock = row.lowStock;
            db.get("SELECT SUM(stock_quantity * price) as totalValue FROM products", (err, row) => {
                stats.totalValue = row.totalValue || 0;
                res.json(stats);
            });
        });
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
