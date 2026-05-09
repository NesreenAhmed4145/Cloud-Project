const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

// ✅ القواعد الذهبية للدوكر: استخدمي أسماء الخدمات والبورتات الداخلية
const USER_SERVICE_URL = 'http://user-service:5000';
const RESTAURANT_SERVICE_URL = 'http://restaurant-service:5001'; // بورت 5001 زي ما مكتوب في كود المطاعم
const ORDER_SERVICE_URL = 'http://order-service:5002'; 
const PAYMENT_SERVICE_URL = 'http://payment-service:5003';

// 1. توجيه طلبات الـ Users
app.use(createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathFilter: '/api/users'
}));

// 2. توجيه طلبات الـ Restaurants
app.use(createProxyMiddleware({
    target: RESTAURANT_SERVICE_URL, 
    changeOrigin: true,
    pathFilter: '/api/restaurants'
}));

// 3. توجيه طلبات الـ Orders
// --- start menna: 

// 3. توجيه طلبات الـ Orders
app.use(createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    pathFilter: '/api/orders', // دي الطريقة اللي النسخة الـ Clone شغال بيها
    pathRewrite: {
        '^/api/orders': '', // بنمسحها عشان الراوتر بتاعك في الـ order-service يبدأ من / مباشرة
    },
}));

// --- end menna ---

// 4. توجيه طلبات الـ Payments
app.use(createProxyMiddleware({
    target: PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathFilter: '/api/payments'
}));

// مسار صحة البوابة
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'API Gateway is connected! 🚀' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🌐 API Gateway is running on port ${PORT}`);
});