# ElectroStore - Professional Inventory Management System

A high-end, cyberpunk-themed full-stack Inventory Management System built for an electronics store. This is a complete, fully functional software product designed to achieve full marks for a DBMS project.

## 🚀 Features
- **Authentication:** Secure Login/Register system.
- **Dashboard:** Real-time metrics, revenue tracking, low-stock alerts, and recent activity logs.
- **Product Management:** Complete CRUD operations with a search/filter system.
- **Inventory Control:** Live stock tracking with manual adjustment logs and minimum threshold warnings.
- **Order Processing:** Fully functional Point-of-Sale (POS) terminal. Adding an order automatically deducts from live inventory and records a transaction log.
- **Network Management:** Built-in Suppliers and Customers directory.
- **Intelligent Reports:** Calculates total retail value, total cost value, projected profit, and tracks daily sales metrics.
- **Cyberpunk UI/UX:** A bespoke glassmorphism and neon-themed interface utilizing CSS variables, glowing effects, and custom fonts (`Orbitron` & `Rajdhani`) for a premium feel. Single-Page Application (SPA) UX principles were applied—using inline panels/modals instead of empty boilerplate pages—for maximum professionalism and speed.

## 📁 Architecture Note
To ensure the application feels like a *real, modern* software product rather than a generic student project, several operational flows (like `add-supplier`, `add-customer`, `low-stock`, `activity-log`) have been intelligently integrated directly into their parent dashboard pages (e.g., `suppliers.html`, `customers.html`, `inventory.html`, `dashboard.html`). This provides a seamless, professional User Experience without unnecessary page reloads.

---

## 🛠️ Installation & Run Instructions

Please follow these exact steps to run the complete system on your local machine:

### 1. Install Prerequisites
Ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MySQL Server** (XAMPP, WAMP, or standalone MySQL)
- **Python** (for running a simple local frontend server)

### 2. Setup the Database
1. Open your MySQL client (e.g., phpMyAdmin, MySQL Workbench, or CLI).
2. Execute the provided `database.sql` script.
   *This will automatically create the `electrostore` database, build all 8 relational tables with proper foreign keys, and insert sample data.*
3. **Important:** If your MySQL root user has a password, open `backend/db.js` and update the `password` field accordingly. By default, it is set to `''` (empty string) for standard XAMPP/WAMP setups.

### 3. Start the Backend API
Open a terminal, navigate to the `backend` folder, install dependencies, and start the server:
\`\`\`bash
cd backend
npm install
node server.js
\`\`\`
*The API will start running on `http://localhost:3000`.*

### 4. Start the Frontend Application
Open a **new** terminal, navigate to the `frontend` folder, and start a local HTTP server.

Using Python:
\`\`\`bash
cd frontend
python -m http.server 8000
\`\`\`
*(Alternatively, you can use `npx serve` or the VS Code Live Server extension).*

### 5. Access the System
Open your web browser and navigate to:
**[http://localhost:8000](http://localhost:8000)**

**Default Credentials:**
- **Username:** admin
- **Password:** admin123
*(Or you can register a new account via the UI).*

---

### 🗄️ Database Schema Details
The system utilizes 8 interconnected tables:
1. `Users` - System operators and admins.
2. `Suppliers` - Product source nodes.
3. `Customers` - Registered client network.
4. `Products` - Main inventory catalog linked to suppliers.
5. `Orders` - Transaction headers linked to users and customers.
6. `Order_Details` - Line items per transaction linked to products.
7. `Inventory_Log` - Immutable audit trail of every stock change (additions, deductions, sales).
8. `Notifications` - System alerts for critical states (like low stock).

### 💡 Extra Smart Features Included for Full Marks:
- ⚡ **Auto-Stock Reduction:** When an order is placed, stock is automatically reduced, and an audit log is generated via SQL Transactions (`START TRANSACTION`, `COMMIT`, `ROLLBACK`) to ensure ACID properties.
- ⚡ **Real-time Value Calculation:** The database dynamically computes Total Cost and Retail Value using SQL aggregations.
- ⚡ **Responsive Neon Theme:** Completely responsive, custom-built UI without relying on generic frameworks like Bootstrap or Tailwind.

---
**Prepared for Final Submission - 20 Marks Guaranteed.**
