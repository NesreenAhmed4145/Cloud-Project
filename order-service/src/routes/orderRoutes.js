// order-service/src/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getUserOrders, 
    updateOrderStatus, 
    getRestaurantOrders 
} = require('../controllers/orderController');

// 1. إنشاء أوردر (POST /)
router.post('/', createOrder);

// 2. مسارات الـ GET - الترتيب هنا "حياة أو موت"
// خلي المسارات اللي فيها كلمات ثابتة (زي user و restaurant) فوق
router.get('/user/:userId', getUserOrders); 
router.get('/restaurant/:restaurantId', getRestaurantOrders); 

// 3. أي مسار عام خليه تحت خالص
router.get('/:id', (req, res) => { /* لجلب أوردر واحد مثلاً */ });

module.exports = router;