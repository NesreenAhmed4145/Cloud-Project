const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // 1. فك التوكن الأول
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log('--- JWT DECODED DATA ---', decoded); // 👈 أضيفي هذا السطر
      // 2. حطي البيانات في req.user عشان السيستم يعرف هو بيكلم مين
      req.user = decoded; 

      // 3. دلوقتي بقى شوفي الـ role اللي جوه req.user (اللي جاية من التوكن)
      // تأكدي إن التوكن أصلاً فيه حقل اسمه role أو type حسب ما برمجتي الـ Login
      if (req.user.type !== 'restaurant_owner') { 
        return res.status(403).json({ message: "Forbidden: Only owners can add restaurants" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'No token, authorization denied' });
  }
};

module.exports = { protect };