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
        const path = window.location.pathname;
        if (!token && !path.includes('index.html') && !path.includes('register.html')) {
            window.location.href = 'index.html';
        }
    }
};

// Auto check auth on load
utils.checkAuth();

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
