const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const orderRoutes = require('./src/routes/orderRoutes');

dotenv.config();
const app = express();
app.use(express.json());

// الربط مع MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Order DB Connected!"))
  .catch((err) => console.log("❌ Order DB Error: ", err));

// تعريف المسارات
app.use('/', orderRoutes); // بنسمح للملف يستقبل من الـ root

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`🚀 Order Service is running on port ${PORT}`);
});