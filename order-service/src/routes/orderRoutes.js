const express = require('express');
const router = express.Router();

const { 
    createOrder, 
    getUserOrders, 
    updateOrderStatus, 
    getRestaurantOrders,
    getAvailableOrders,
    assignDelivery // 👈 1. استدعينا دالة الاستلام هنا
} = require('../controllers/orderController');

// 1. إنشاء أوردر
router.post('/', createOrder);

// 2. مسارات الدليفري (لازم فوق عشان متتلخبطش مع الـ IDs)
router.get('/available', getAvailableOrders); 

// 👈 2. المسار الجديد بتاع الاستلام (هنحط POST و PATCH احتياطي عشان الفرونت إند)
router.post('/assign', assignDelivery); 
router.patch('/assign', assignDelivery); 

// 3. مسارات الـ GET المحددة
router.get('/user/:userId', getUserOrders); 
router.get('/restaurant/:restaurantId', getRestaurantOrders); 

// 4. مسار التحديث العادي
router.patch('/:id/status', updateOrderStatus); 

module.exports = router;