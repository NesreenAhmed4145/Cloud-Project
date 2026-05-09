// 

const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

// ✅ القواعد الذهبية للدوكر: استخدمي أسماء الخدمات والبورتات الداخلية
const USER_SERVICE_URL = 'http://user-service:5000';
const RESTAURANT_SERVICE_URL = 'http://restaurant-service:5001'; 
const ORDER_SERVICE_URL = 'http://order-service:5002'; 
const PAYMENT_SERVICE_URL = 'http://payment-service:5003';

// 1. توجيه طلبات الـ Users
// --- start menna ---
app.use('/api/users', createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/users': '' }, // مسح المسار عشان يوصل للـ service نضيف
}));
// --- end menna ---

// 2. توجيه طلبات الـ Restaurants
// --- start menna ---
app.use('/api/restaurants', createProxyMiddleware({
    target: RESTAURANT_SERVICE_URL, 
    changeOrigin: true,
    pathRewrite: { '^/api/restaurants': '' },
}));
// --- end menna ---

// 3. توجيه طلبات الـ Orders (مسؤولية منة)
// --- start menna ---
app.use('/api/orders', createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/orders': '', // مسح الجزء ده عشان يروح للـ Router اللي عملناه مباشرة
    },
}));
// --- end menna ---

// 4. توجيه طلبات الـ Payments
// --- start menna ---
app.use('/api/payments', createProxyMiddleware({
    target: PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/payments': '' },
}));
// --- end menna ---

// مسار صحة البوابة
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'API Gateway is connected! 🚀' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🌐 API Gateway is running on port ${PORT}`);
});