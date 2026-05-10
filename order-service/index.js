const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 👈 التعديل هنا: بما إن index.js بره، لازم يدخل src الأول
const orderRoutes = require('./src/routes/orderRoutes'); 

const app = express();
app.use(cors());
app.use(express.json());

// 1. توصيل الداتا بيز (ده اللي هيحل الـ 504)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/food_delivery_orders';
mongoose.connect(MONGO_URI)
  .then(() => console.log('🍃 Order Service connected to MongoDB'))
  .catch(err => console.error('❌ Order Service Mongo Error:', err));

// 2. الـ Routes
// البوابة بتمسح /api/orders وبتبعت الباقي، فإحنا بنستقبل هنا علطول
app.use('/', orderRoutes); 

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Order Service is truly running on port ${PORT}`);
});