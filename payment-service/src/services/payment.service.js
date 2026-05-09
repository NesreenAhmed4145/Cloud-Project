const Payment = require('../models/Payment');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

exports.createPayment = async (data) => {
  // بنخزن البيانات اللي جاية (المبلغ، الطريقة، وتفاصيل الدفع)
  return await Payment.create(data);
};

exports.processPayment = async (id, paymentDetails) => {
  const payment = await Payment.findById(id);
  if (!payment) throw new Error("Payment record not found");

  let isSuccess = false;
  let failureReason = "";

  // المنطق الواقعي بناءً على طريقة الدفع
  const { method } = payment; // card, fawry, vodafone_cash

  if (method === 'card') {
    // محاكاة التحقق من الفيزا (واقعي)
    const { cardNumber, expiryDate, cvv } = paymentDetails;
    
    // 1. التأكد من الـ CVV (لازم يكون 3 أرقام)
    const isCvvValid = /^\d{3}$/.test(cvv);
    
    // 2. التأكد من تاريخ الصلاحية (بسيط للمشروع)
    const [month, year] = expiryDate.split('/').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // بياخد آخر رقمين 2026 -> 26
    const currentMonth = now.getMonth() + 1;
    
    const isNotExpired = (year > currentYear) || (year === currentYear && month >= currentMonth);

    if (isCvvValid && isNotExpired && cardNumber.length >= 14) {
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
    payment.transactionId = uuidv4();
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