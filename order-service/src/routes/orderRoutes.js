const express = require('express');
const router = express.Router();

const { 
    createOrder, 
    getUserOrders, 
    updateOrderStatus, 
    getRestaurantOrders,
    getAvailableOrders // 👈 1. استدعينا الدالة الجديدة هنا
} = require('../controllers/orderController');

// 1. إنشاء أوردر
router.post('/', createOrder);

// 2. مسار الدليفري (الجديد) 👈 لازم يكون فوق عشان كلمة available تتقري كمسار مش كـ ID
router.get('/available', getAvailableOrders); 

// 3. مسارات الـ GET المحددة
router.get('/user/:userId', getUserOrders); 
router.get('/restaurant/:restaurantId', getRestaurantOrders); 

// 4. مسار التحديث
router.patch('/:id/status', updateOrderStatus); 

module.exports = router;