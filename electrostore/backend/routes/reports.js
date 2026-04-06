const express = require('express');
const router = express.Router();
const db = require('../db');

// Sales Report
router.get('/sales', async (req, res) => {
    try {
        const [sales] = await db.query(`
            SELECT DATE(order_date) as date, SUM(total_amount) as total_revenue, COUNT(id) as total_orders
            FROM Orders 
            WHERE status = 'completed'
            GROUP BY DATE(order_date)
            ORDER BY date DESC
            LIMIT 30
        `);
        res.json(sales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Inventory Value
router.get('/inventory-value', async (req, res) => {
    try {
        const [inventory] = await db.query(`
            SELECT 
                SUM(stock * price) as total_retail_value, 
                SUM(stock * cost) as total_cost_value,
                SUM(stock) as total_items
            FROM Products
        `);
        res.json(inventory[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Low Stock Alert
router.get('/low-stock', async (req, res) => {
    try {
        const [lowStock] = await db.query(`
            SELECT id, sku, name, stock, min_stock_level 
            FROM Products 
            WHERE stock <= min_stock_level
        `);
        res.json(lowStock);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
