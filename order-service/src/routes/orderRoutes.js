const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, updateOrderStatus , getRestaurantOrders } = require('../controllers/orderController');

// 1. خليه يقبل الـ root (عشان لو الـ index باعتله المسار جاهز)
router.get('/', getUserOrders); 

// 2. وخليه يقبل المسار كامل (عشان لو الـ Gateway باعت المسار كامل)
router.get('/api/orders', getUserOrders); 

// 3. وخليه يقبل اليوزر (عشان الفرونت إند)
router.get('/:userId', getUserOrders);
router.get('/api/orders/:userId', getUserOrders);

// باقي المسارات (POST & PATCH) بنفس الطريقة
router.post('/', createOrder);
router.post('/api/orders', createOrder);

// 2. ضيفي المسار اللي ناقص وهو ده سبب الـ 404
router.get('/restaurant/:restaurantId', getRestaurantOrders);

// 3. (نصيحة) ضيفي نسخة تانية احتياطي بالـ prefix لو الـ Gateway باعتها كاملة
router.get('/api/orders/restaurant/:restaurantId', getRestaurantOrders);

module.exports = router;