 DROP DATABASE IF EXISTS electrostore;

CREATE DATABASE IF NOT EXISTS electrostore;
USE electrostore;

-- 1. Users (login system)
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'staff', 'customer') DEFAULT 'staff',
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
    email VARCHAR(100) UNIQUE NOT NULL,
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
    image_url VARCHAR(255),
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
    status ENUM('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
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

-- Insert sample data (using user's provided data but adapted)
INSERT IGNORE INTO Users (username, password, role, email) VALUES 
('admin', 'admin123', 'admin', 'admin@electrostore.com'),
('john_doe', 'pass123', 'staff', 'john@example.com');

INSERT IGNORE INTO Customers (name, email, phone, address) VALUES 
('Alice Smith', 'alice@example.com', '1234567890', '123 Elm St, NY'),
('Bob Johnson', 'bob@example.com', '0987654321', '456 Oak St, CA');

INSERT IGNORE INTO Suppliers (name, contact_person, email, phone) VALUES 
('TechCorp', 'Michael Scott', 'michael@techcorp.com', '1112223333'),
('ElectroSupply', 'Dwight Schrute', 'dwight@electrosupply.com', '4445556666');

INSERT IGNORE INTO Products (sku, name, description, price, cost, stock, category, supplier_id, image_url, min_stock_level) VALUES 
('PHN-001', 'Smartphone X', 'Latest 5G smartphone with 128GB storage.', 699.99, 500.00, 50, 'Electronics', 1, 'https://via.placeholder.com/200?text=Smartphone', 10),
('LAP-001', 'Laptop Pro 15', 'High performance laptop for professionals.', 1299.99, 1000.00, 20, 'Computers', 1, 'https://via.placeholder.com/200?text=Laptop', 5),
('EAR-001', 'Wireless Earbuds', 'Noise cancelling true wireless earbuds.', 149.99, 80.00, 100, 'Accessories', 2, 'https://via.placeholder.com/200?text=Earbuds', 15),
('TV-001', 'Smart TV 55"', '4K UHD Smart TV with HDR.', 499.99, 350.00, 15, 'TV & Home Theater', 2, 'https://via.placeholder.com/200?text=Smart+TV', 5),
('GME-001', 'Gaming Console V', 'Next-gen gaming console.', 499.99, 400.00, 5, 'Gaming', 1, 'https://via.placeholder.com/200?text=Gaming+Console', 10);

-- Insert sample orders
INSERT IGNORE INTO Orders (id, customer_id, user_id, total_amount, status, payment_method) VALUES 
(1, 1, 1, 849.98, 'completed', 'Credit Card'),
(2, 2, 1, 1299.99, 'pending', 'Cash');

-- Insert order details
INSERT IGNORE INTO Order_Details (order_id, product_id, quantity, unit_price, subtotal) VALUES 
(1, 1, 1, 699.99, 699.99),
(1, 3, 1, 149.99, 149.99),
(2, 2, 1, 1299.99, 1299.99);
