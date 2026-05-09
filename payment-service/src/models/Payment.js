const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
method: {
  type: String,
  enum: ['card', 'fawry', 'vodafone_cash'],
  required: true
},
  transactionId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);