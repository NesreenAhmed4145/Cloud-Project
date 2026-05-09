//Cloud-Project\payment-service\src\routes\payment.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment.controller');
// Cloud-Project\payment-service\src\routes\payment.routes.js

// 1. إنشاء عملية دفع جديدة (المسار النهائي بقى /api/payments)
router.post('/', controller.createPayment);

// 2. تنفيذ الدفع (المسار النهائي بقى /api/payments/:id/process)
router.post('/:id/process', controller.processPayment);

// 3. الاستعلام (المسار النهائي بقى /api/payments/:id)
router.get('/:id', controller.getPayment);

module.exports = router;