const utils = {
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    },
    formatDate(dateString) {
        const d = new Date(dateString);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    },
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },
    checkAuth() {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        const path = window.location.pathname;
        const isPublicPage = path.includes('index.html') || path.includes('register.html') || path.endsWith('/');
        
        if (!token && !isPublicPage) {
            window.location.href = 'index.html';
            return;
        }

        if (user && !isPublicPage) {
            // Role-based page access control
            const adminOnlyPages = ['inventory.html', 'suppliers.html', 'reports.html'];
            const isRestrictedPage = adminOnlyPages.some(p => path.includes(p));
            
            if (isRestrictedPage && user.role !== 'admin') {
                this.showToast('Access Denied: Admin authorization required', 'error');
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
                return;
            }

            this.restrictUI(user.role);
        }
    },
    restrictUI(role) {
        // Define which links are admin-only
        const adminOnlyLinks = ['inventory.html', 'suppliers.html', 'reports.html'];
        
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (role !== 'admin' && adminOnlyLinks.some(adminLink => href.includes(adminLink))) {
                link.parentElement.style.display = 'none';
            }
        });

        // Also restrict actions on pages if needed
        if (role !== 'admin') {
            const adminButtons = document.querySelectorAll('.admin-only');
            adminButtons.forEach(btn => btn.style.display = 'none');
        }
    }
};

// Auto check auth on load when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    utils.checkAuth();
});

// Simple Toast CSS injection
const style = document.createElement('style');
style.textContent = `
.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 1rem 2rem;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    z-index: 1000;
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
}
.toast-success { background: rgba(0, 255, 136, 0.9); border: 1px solid #00ff88; }
.toast-error { background: rgba(255, 0, 60, 0.9); border: 1px solid #ff003c; }
@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
`;
document.head.appendChild(style);
