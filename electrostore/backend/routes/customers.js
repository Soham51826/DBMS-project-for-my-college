const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all customers
router.get('/', async (req, res) => {
    try {
        const [customers] = await db.query('SELECT * FROM Customers ORDER BY name ASC');
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single customer
router.get('/:id', async (req, res) => {
    try {
        const [customer] = await db.query('SELECT * FROM Customers WHERE id = ?', [req.params.id]);
        res.json(customer[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add customer
router.post('/', async (req, res) => {
    try {
        const { name, phone, email, address } = req.body;
        const [result] = await db.query(
            'INSERT INTO Customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
            [name, phone, email, address]
        );
        res.json({ success: true, customerId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update customer
router.put('/:id', async (req, res) => {
    try {
        const { name, phone, email, address } = req.body;
        await db.query(
            'UPDATE Customers SET name=?, phone=?, email=?, address=? WHERE id=?',
            [name, phone, email, address, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete customer
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM Customers WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
