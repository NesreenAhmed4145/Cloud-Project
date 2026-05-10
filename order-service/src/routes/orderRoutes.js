// order-service/src/routes/orderRoutes.js

const express = require('express');
const router = express.Router();

// استدعاء كل الـ Functions من الـ Controller
const { 
    createOrder, 
    getUserOrders, 
    updateOrderStatus, 
    getRestaurantOrders 
} = require('../controllers/orderController');

// 1. إنشاء أوردر (POST /)
router.post('/', createOrder);

// 2. مسارات الـ GET المحددة (Specific Routes)
router.get('/user/:userId', getUserOrders); 
router.get('/restaurant/:restaurantId', getRestaurantOrders); 

// 3. مسار التحديث (PATCH) - ده اللي هيشغل زرار Confirm
// مكانه هنا آمن جداً ومش هيتعارض مع حاجة
router.patch('/:id/status', updateOrderStatus); 

// 4. المسار العام (Generic Route)
// أنا عملتله كومنت (تجميد) مؤقتاً عشان ده اللي غالباً كان "بياكل" المسارات التانية ويعمل 504
// لو احتجتيه بعدين نبقى نفتحه
// router.get('/:id', (req, res) => { /* ... */ });

module.exports = router;