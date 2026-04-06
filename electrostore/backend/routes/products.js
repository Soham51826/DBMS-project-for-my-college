const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all products
router.get('/', async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = 'SELECT p.*, s.name as supplier_name FROM Products p LEFT JOIN Suppliers s ON p.supplier_id = s.id WHERE 1=1';
        let params = [];
        
        if (search) {
            query += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (category) {
            query += ' AND p.category = ?';
            params.push(category);
        }
        
        const [products] = await db.query(query, params);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get product by id
router.get('/:id', async (req, res) => {
    try {
        const [product] = await db.query('SELECT p.*, s.name as supplier_name FROM Products p LEFT JOIN Suppliers s ON p.supplier_id = s.id WHERE p.id = ?', [req.params.id]);
        if (product.length > 0) {
            res.json(product[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new product
router.post('/', async (req, res) => {
    try {
        const { sku, name, category, description, price, cost, stock, min_stock_level, supplier_id } = req.body;
        const [result] = await db.query(
            'INSERT INTO Products (sku, name, category, description, price, cost, stock, min_stock_level, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [sku, name, category, description, price, cost, stock, min_stock_level, supplier_id]
        );
        res.json({ success: true, productId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const { sku, name, category, description, price, cost, stock, min_stock_level, supplier_id } = req.body;
        await db.query(
            'UPDATE Products SET sku=?, name=?, category=?, description=?, price=?, cost=?, stock=?, min_stock_level=?, supplier_id=? WHERE id=?',
            [sku, name, category, description, price, cost, stock, min_stock_level, supplier_id, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM Products WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Inventory stock adjustment (add/remove stock)
router.post('/:id/adjust', async (req, res) => {
    try {
        const { quantity, change_type, reason, user_id } = req.body;
        const product_id = req.params.id;
        
        await db.query('START TRANSACTION');
        
        let updateQuery = '';
        if (change_type === 'addition') {
            updateQuery = 'UPDATE Products SET stock = stock + ? WHERE id = ?';
        } else if (change_type === 'reduction') {
            updateQuery = 'UPDATE Products SET stock = stock - ? WHERE id = ?';
        } else if (change_type === 'adjustment') {
            updateQuery = 'UPDATE Products SET stock = ? WHERE id = ?';
        }
        
        await db.query(updateQuery, [quantity, product_id]);
        
        await db.query(
            'INSERT INTO Inventory_Log (product_id, user_id, change_type, quantity_changed, reason) VALUES (?, ?, ?, ?, ?)',
            [product_id, user_id || 1, change_type, quantity, reason]
        );
        
        await db.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
