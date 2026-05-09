const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');
// 1. للعميل: عرض كل المطاعم
router.get('/', controller.getAllRestaurants);

// 2. للعميل: عرض تفاصيل مطعم واحد بالـ ID
router.get('/:id', controller.getRestaurantDetails);

// 3. للإدمن: إضافة مطعم جديد
router.post('/', protect,controller.createRestaurant);

// 4. للإدمن: تعديل صنف في المنيو
router.put('/:id/menu/:itemId', controller.updateMenuItem);

// 5. داخلي: التحقق من الطلب (للـ Order Service)
router.post('/validate-items', controller.validateItems);



module.exports = router;