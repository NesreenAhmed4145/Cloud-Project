const Payment = require('../models/Payment');
// حطي ده ✅
const crypto = require('crypto');
const axios = require('axios');

exports.createPayment = async (data) => {
  // بنخزن البيانات اللي جاية (المبلغ، الطريقة، وتفاصيل الدفع)
  return await Payment.create(data);
};
// payment-service/src/services/payment.service.js

exports.processPayment = async (id, paymentDetails) => {
  const payment = await Payment.findById(id);
  if (!payment) throw new Error("Payment record not found");

  let isSuccess = false;
  let failureReason = "";
  const { method } = payment;

  if (method === 'card') {
    // 👈 التعديل هنا: بنقرأ من cardDetails اللي جاية من الفرونت إند
    const { number, expiry, cvv } = paymentDetails.cardDetails || {};
    
    if (!expiry) {
        throw new Error("Expiry date is missing in request");
    }

    // التأكد من الـ CVV
    const isCvvValid = /^\d{3}$/.test(cvv);
    
    // تقسيم التاريخ (اللي هو دلوقتي اسمه expiry)
    const [month, year] = expiry.split('/').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    const isNotExpired = (year > currentYear) || (year === currentYear && month >= currentMonth);

    if (isCvvValid && isNotExpired && number && number.length >= 14) {
      isSuccess = true;
    } else {
      failureReason = !isNotExpired ? "Card Expired" : "Invalid Card Details";
    }

  } else if (method === 'vodafone_cash') {
    // محاكاة فودافون كاش: التأكد من رقم الموبايل (11 رقم وبدأ بـ 010)
    const { phoneNumber } = paymentDetails;
    if (/^010\d{8}$/.test(phoneNumber)) {
      isSuccess = true;
    } else {
      failureReason = "Invalid Vodafone Cash Number";
    }

  } else if (method === 'fawry') {
    // فوري دايماً بينجح في مرحلة إنشاء الكود
    isSuccess = true;
  }

  // تحديث الحالة بناءً على النتيجة الواقعية
  if (isSuccess) {
    payment.status = 'completed';
    // بدلاً من uuidv4()
payment.transactionId = crypto.randomUUID();
  } else {
    payment.status = 'failed';
    console.log(`❌ Payment failed reason: ${failureReason}`);
  }

  await payment.save();

  // إبلاغ خدمة الطلبات (Order Service)
  try {
    await axios.post(`${process.env.ORDER_SERVICE_URL}/orders/${payment.orderId}/payment-status`, {
      status: payment.status,
      reason: failureReason
    });
  } catch (err) {
    console.log("⚠️ Order service unreachable, status saved locally.");
  }

  return { payment, failureReason };
};

exports.getPayment = async (id) => {
  return Payment.findById(id);
};