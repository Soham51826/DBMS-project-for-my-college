const express = require('express');
const router = express.Router();
const db = require('../db');

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [users] = await db.query('SELECT id, username, role, email FROM Users WHERE username = ? AND password = ?', [username, password]);
        if (users.length > 0) {
            res.json({ success: true, user: users[0], token: 'dummy-token-' + users[0].id });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        const [result] = await db.query('INSERT INTO Users (username, password, email, role) VALUES (?, ?, ?, ?)', [username, password, email, role || 'staff']);
        res.json({ success: true, userId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
