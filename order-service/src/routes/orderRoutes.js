const express = require('express');
const router = express.Router();

// استدعاء كل الدوال (بما فيهم getMyDeliveries اللي عملت المشكلة)
const { 
    createOrder, 
    getUserOrders, 
    updateOrderStatus, 
    getRestaurantOrders,
    getAvailableOrders,
    assignDelivery,
    getMyDeliveries
} = require('../controllers/orderController');

// 1. المسارات الثابتة (لازم تبقى فوق عشان متتلخبطش مع الـ IDs)
router.post('/', createOrder);
router.get('/available', getAvailableOrders); 
router.post('/assign', assignDelivery); 
router.patch('/assign', assignDelivery); 

// 2. المسارات اللي فيها IDs
router.get('/delivery/:deliveryId', getMyDeliveries); // 👈 المسار الجديد للعهدة
router.get('/user/:userId', getUserOrders); 
router.get('/restaurant/:restaurantId', getRestaurantOrders); 
router.patch('/:id/status', updateOrderStatus); 

module.exports = router;