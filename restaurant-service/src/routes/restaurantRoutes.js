const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantController');
const { getRestaurantByOwner } = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');

// 1. للعميل: عرض كل المطاعم
router.get('/', controller.getAllRestaurants);

// 2. 👈 (التعديل هنا) نقلنا ده فوق الـ /:id
// غيري المسار ليكون كده (كلمة fetch-owner مميزة ومستحيل تتعارض مع الـ :id)
router.get('/owner/:ownerId', controller.getRestaurantByOwner);

// 3. للعميل: عرض تفاصيل مطعم واحد بالـ ID
router.get('/:id', controller.getRestaurantDetails);

// 4. للإدمن: إضافة مطعم جديد
router.post('/', protect, controller.createRestaurant);

// 5. للإدمن: تعديل صنف في المنيو
router.put('/:id/menu/:itemId', controller.updateMenuItem);

// 6. داخلي: التحقق من الطلب (للـ Order Service)
router.post('/validate-items', controller.validateItems);

module.exports = router;