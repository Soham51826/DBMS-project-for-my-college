const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const path = require('path');

app.use(cors());
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const usersRoutes = require('./routes/users');
// ... (rest of routes)

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use('/api/users', usersRoutes);
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const suppliersRoutes = require('./routes/suppliers');
const customersRoutes = require('./routes/customers');
const reportsRoutes = require('./routes/reports');

app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/reports', reportsRoutes);

app.get('/api/dashboard', async (req, res) => {
    const db = require('./db');
    try {
        const [products] = await db.query('SELECT COUNT(*) as count FROM Products');
        const [orders] = await db.query('SELECT COUNT(*) as count FROM Orders');
        const [lowStock] = await db.query('SELECT COUNT(*) as count FROM Products WHERE stock <= min_stock_level');
        const [revenue] = await db.query('SELECT SUM(total_amount) as total FROM Orders WHERE status = "completed"');
        const [recentActivity] = await db.query('SELECT * FROM Inventory_Log ORDER BY created_at DESC LIMIT 5');

        res.json({
            totalProducts: products[0].count,
            totalOrders: orders[0].count,
            lowStockItems: lowStock[0].count,
            totalRevenue: revenue[0].total || 0,
            recentActivity
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`ElectroStore Backend running on http://localhost:${port}`);
});
