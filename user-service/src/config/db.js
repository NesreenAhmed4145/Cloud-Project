const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // الاتصال بقاعدة البيانات باستخدام الرابط المخفي في ملف .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // لو الاتصال نجح، اطبع رسالة في الـ Terminal
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // لو حصل مشكلة (مثلاً الداتا بيز مقفولة أو الرابط غلط)، اطبع المشكلة
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    
    // اقفل السيرفر فوراً لأن مفيش فايدة يشتغل من غير داتا بيز (1 معناها خروج بسبب خطأ)
    process.exit(1);
  }
};

module.exports = connectDB;