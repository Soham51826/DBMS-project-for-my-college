CREATE DATABASE IF NOT EXISTS electrostore;
USE electrostore;

-- 1. Users (login system)
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Suppliers
CREATE TABLE IF NOT EXISTS Suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Customers
CREATE TABLE IF NOT EXISTS Customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Products
CREATE TABLE IF NOT EXISTS Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    min_stock_level INT NOT NULL DEFAULT 10,
    supplier_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(id) ON DELETE SET NULL
);

-- 5. Orders
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    user_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES Customers(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL
);

-- 6. Order_Details
CREATE TABLE IF NOT EXISTS Order_Details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE RESTRICT
);

-- 7. Inventory_Log
CREATE TABLE IF NOT EXISTS Inventory_Log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT,
    change_type ENUM('addition', 'reduction', 'adjustment') NOT NULL,
    quantity_changed INT NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL
);

-- 8. Notifications
CREATE TABLE IF NOT EXISTS Notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SAMPLE DATA
INSERT INTO Users (username, password, role, email) VALUES 
('admin', 'admin123', 'admin', 'admin@electrostore.com'),
('manager1', 'manager123', 'manager', 'manager@electrostore.com');

INSERT INTO Suppliers (name, contact_person, phone, email, address) VALUES
('TechSource Inc', 'John Doe', '123-456-7890', 'john@techsource.com', '123 Silicon Valley, CA'),
('Global Electronics', 'Jane Smith', '987-654-3210', 'jane@globalelec.com', '456 Tech Park, NY');

INSERT INTO Customers (name, phone, email, address) VALUES
('Alice Johnson', '555-0101', 'alice@example.com', '789 Elm St'),
('Bob Williams', '555-0202', 'bob@example.com', '101 Pine St');

INSERT INTO Products (sku, name, category, description, price, cost, stock, min_stock_level, supplier_id) VALUES
('SKU-001', 'Quantum X1 Laptop', 'Laptops', 'High-end gaming laptop', 1499.99, 1200.00, 25, 5, 1),
('SKU-002', 'Neon 4K Monitor', 'Monitors', '27 inch 144Hz Monitor', 349.99, 250.00, 8, 10, 2),
('SKU-003', 'CyberMech Keyboard', 'Accessories', 'Mechanical RGB Keyboard', 129.99, 80.00, 50, 15, 1);

INSERT INTO Orders (customer_id, user_id, total_amount, status, payment_method) VALUES
(1, 1, 1499.99, 'completed', 'Credit Card');

INSERT INTO Order_Details (order_id, product_id, quantity, unit_price, subtotal) VALUES
(1, 1, 1, 1499.99, 1499.99);

INSERT INTO Notifications (type, message) VALUES
('low_stock', 'Product Neon 4K Monitor (SKU-002) is below minimum stock level.');
