const paymentService = require('../services/payment.service');

exports.createPayment = async (req, res) => {
  try {
    // بياخد orderId, amount, method من الـ body
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.processPayment = async (req, res) => {
  try {
    // بياخد الـ id من الـ URL وتفاصيل الكارت/الموبايل من الـ body
    const { payment, failureReason } = await paymentService.processPayment(req.params.id, req.body);
    
    if (payment.status === 'failed') {
      return res.status(400).json({ status: 'Failed', reason: failureReason });
    }
    
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await paymentService.getPayment(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};