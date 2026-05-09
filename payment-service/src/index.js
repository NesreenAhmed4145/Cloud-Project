// // Cloud-Project\payment-service\index.js

// // 1. استدعاء الـ app الحقيقي اللي فيه كل الـ Routes
// const app = require('./src/app'); 

// // 2. تحديد البورت
// const PORT = process.env.PORT || 5003; 

// // 3. تشغيل السيرفر الحقيقي
// app.listen(PORT, () => {
//     console.log(`🚀 Payment Service is TRULY running on port ${PORT}`);
// });
// payment-service/src/index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 1. استدعاء مكتبة mongoose
const paymentRoutes = require('./routes/payment.routes');

const app = express();
app.use(cors()); 
app.use(express.json());

// 2. الاتصال بقاعدة البيانات (ده السطر اللي كان ناقص)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/food_delivery_payments';

mongoose.connect(MONGO_URI)
  .then(() => console.log('🍃 Connected to MongoDB Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.use('/api/payments', paymentRoutes);

app.get('/health', (req, res) => res.send('✅ Payment Service is UP and Connected!'));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 Payment Service is running on port ${PORT}`);
});