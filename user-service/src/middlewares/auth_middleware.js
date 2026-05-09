const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  // 1. استخراج التوكن من الـ Headers (الفرونت إند بيبعته بصيغة: Bearer <token>)
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. لو مفيش توكن، نرفض الطلب
  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized, Please Login Again" });
  }

  try {
    // 3. فك تشفير التوكن والتأكد من صحته
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. حفظ الـ ID اللي طلعناه جوه req.user عشان الكنترولر يقدر يستخدمه
    req.user = { id: decoded.id };
    
    // 5. السماح بالمرور للكنترولر
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or Expired Token" });
  }
};

module.exports = authMiddleware;