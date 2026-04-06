// Generate HTML files
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'frontend');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const pages = [
    { name: 'index.html', title: 'Login', isAuth: true },
    { name: 'register.html', title: 'Register', isAuth: true },
    { name: 'dashboard.html', title: 'Dashboard' },
    { name: 'products.html', title: 'Products' },
    { name: 'add-product.html', title: 'Add Product' },
    { name: 'suppliers.html', title: 'Suppliers' },
    { name: 'customers.html', title: 'Customers' },
    { name: 'orders.html', title: 'Orders' },
    { name: 'add-order.html', title: 'Create Order' },
    { name: 'inventory.html', title: 'Inventory' },
    { name: 'low-stock.html', title: 'Low Stock Alerts' },
    { name: 'reports.html', title: 'Reports' },
    { name: 'analytics.html', title: 'Analytics' }
];

const sidebarHtml = `
<aside class="sidebar">
    <div class="brand">ELECTRO<span>STORE</span></div>
    <ul class="nav-links">
        <li><a href="dashboard.html">Dashboard</a></li>
        <li><a href="products.html">Products</a></li>
        <li><a href="inventory.html">Inventory</a></li>
        <li><a href="orders.html">Orders</a></li>
        <li><a href="customers.html">Customers</a></li>
        <li><a href="suppliers.html">Suppliers</a></li>
        <li><a href="reports.html">Reports</a></li>
        <li><a href="index.html" style="color:var(--secondary);margin-top:2rem;">Logout</a></li>
    </ul>
</aside>
`;

const getBaseHtml = (page) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ElectroStore - ${page.title}</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body ${page.isAuth ? 'style="margin:0; justify-content:center; align-items:center;"' : ''}>
    ${page.isAuth ? '' : sidebarHtml}
    
    <main class="${page.isAuth ? 'login-container' : 'main-content'}">
        <div id="app-content">
            <!-- Content Injected Here -->
        </div>
    </main>

    <script src="js/api.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/main.js"></script>
</body>
</html>`;

pages.forEach(p => {
    fs.writeFileSync(path.join(outDir, p.name), getBaseHtml(p));
});

console.log('HTML scaffold generated.');
