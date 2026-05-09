const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment.controller');

// 1. إنشاء عملية دفع جديدة
router.post('/payments', controller.createPayment);

// 2. تنفيذ الدفع (هنا بنبعت بيانات الفيزا أو فودافون كاش)
router.post('/payments/:id/process', controller.processPayment);

// 3. الاستعلام عن حالة دفعة معينة
router.get('/payments/:id', controller.getPayment);

module.exports = router;