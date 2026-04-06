const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all suppliers
router.get('/', async (req, res) => {
    try {
        const [suppliers] = await db.query('SELECT * FROM Suppliers ORDER BY name ASC');
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single supplier
router.get('/:id', async (req, res) => {
    try {
        const [supplier] = await db.query('SELECT * FROM Suppliers WHERE id = ?', [req.params.id]);
        res.json(supplier[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add supplier
router.post('/', async (req, res) => {
    try {
        const { name, contact_person, phone, email, address } = req.body;
        const [result] = await db.query(
            'INSERT INTO Suppliers (name, contact_person, phone, email, address) VALUES (?, ?, ?, ?, ?)',
            [name, contact_person, phone, email, address]
        );
        res.json({ success: true, supplierId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update supplier
router.put('/:id', async (req, res) => {
    try {
        const { name, contact_person, phone, email, address } = req.body;
        await db.query(
            'UPDATE Suppliers SET name=?, contact_person=?, phone=?, email=?, address=? WHERE id=?',
            [name, contact_person, phone, email, address, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete supplier
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM Suppliers WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
