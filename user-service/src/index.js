const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/user_routes'); // 1. استدعاء المسارات اللي عملناها

// تحميل متغيرات البيئة
dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// Middlewares أساسية
app.use(cors());
app.use(express.json());

// 2. ربط مسارات المستخدمين بالرابط الأساسي
// أي طلب بيبدأ بـ /api/users هيروح لملف الـ routes اللي عملناه
app.use('/api/users', userRoutes);

// مسار صحة السيرفر (عشان الـ DevOps والـ Kubernetes يتأكدوا إنه شغال)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'User Service' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ User Service is running perfectly on port ${PORT}`);
});