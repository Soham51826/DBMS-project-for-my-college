const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.*, c.name as customer_name, u.username as user_name 
            FROM Orders o 
            LEFT JOIN Customers c ON o.customer_id = c.id
            LEFT JOIN Users u ON o.user_id = u.id
            ORDER BY o.order_date DESC
        `);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new order (includes order details and stock reduction)
router.post('/', async (req, res) => {
    try {
        const { customer_id, user_id, payment_method, items } = req.body;
        // items: [{product_id, quantity, unit_price}]
        
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must contain items' });
        }

        await db.query('START TRANSACTION');

        // Calculate total amount
        let total_amount = 0;
        for (const item of items) {
            total_amount += item.quantity * item.unit_price;
        }

        // Insert order
        const [orderResult] = await db.query(
            'INSERT INTO Orders (customer_id, user_id, total_amount, status, payment_method) VALUES (?, ?, ?, ?, ?)',
            [customer_id, user_id || 1, total_amount, 'completed', payment_method]
        );
        const orderId = orderResult.insertId;

        // Insert details and reduce stock
        for (const item of items) {
            const subtotal = item.quantity * item.unit_price;
            await db.query(
                'INSERT INTO Order_Details (order_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.unit_price, subtotal]
            );
            
            // Reduce stock
            await db.query(
                'UPDATE Products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );

            // Add log
            await db.query(
                'INSERT INTO Inventory_Log (product_id, user_id, change_type, quantity_changed, reason) VALUES (?, ?, ?, ?, ?)',
                [item.product_id, user_id || 1, 'reduction', item.quantity, `Sold in Order #${orderId}`]
            );
        }

        await db.query('COMMIT');
        res.json({ success: true, orderId });
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});

// Get order details
router.get('/:id', async (req, res) => {
    try {
        const [order] = await db.query(`
            SELECT o.*, c.name as customer_name, c.email as customer_email, u.username as user_name 
            FROM Orders o 
            LEFT JOIN Customers c ON o.customer_id = c.id
            LEFT JOIN Users u ON o.user_id = u.id
            WHERE o.id = ?
        `, [req.params.id]);

        if (order.length === 0) return res.status(404).json({ message: 'Order not found' });

        const [items] = await db.query(`
            SELECT od.*, p.name as product_name, p.sku
            FROM Order_Details od
            JOIN Products p ON od.product_id = p.id
            WHERE od.order_id = ?
        `, [req.params.id]);

        res.json({ ...order[0], items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
