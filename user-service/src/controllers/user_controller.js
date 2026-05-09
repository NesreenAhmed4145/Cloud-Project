const User = require('../models/user_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // تعديل 1: استخدام require
const validator = require('validator'); // تعديل 1


// ✅ بنخلي الدالة تستقبل الـ id والـ type
const createToken = (id, type) => {
  return jwt.sign(
    { 
      id: id, 
      type: type 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: '30d' 
    }
  );
};

module.exports = createToken;
// تعديل 3: الترتيب الصحيح هو (req, res)
const registerUser = async (req, res) => {
  try {
    // تعديل 4: إزالة شرط if(res.data) الاعتماد على req.body مباشرة
    const { name, email, password, address, type } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      // إصلاح كلمة success وإضافة كود 400 (Bad Request)
      return res.status(400).json({ success: false, message: "user already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      address,
      type
    });

    // تعديل 5: حفظ المستخدم فعلياً في قاعدة البيانات
    await newUser.save();

    const token = createToken(newUser._id,newUser.type);
    
    res.status(201).json({ success: true, message: "Account created successfully!", token });

  } catch (error) {
    res.status(500).json({ message: 'Error in Server', error: error.message });
  }
}
const loginUser = async (req,res)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});

    if(!user){
      return res.status(404).json({ success: false, message: "User doesn't exist" });
    }

    // ✅ التصحيح 1: إضافة await عشان الباسورد الغلط ميعديش
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({success:false , message : "Invalid credentials"});
    }

    // ✅ التصحيح 2: تمرير الـ type مع الـ id عشان التوكن يبقى كامل
    const token = createToken(user._id, user.type);

    res.status(200).json({ 
      success: true, 
      message: "Login successful", 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error in Server', error: error.message });
  }
}
const getUserProfile = async (req,res)=>{

    try{
        const userId = req.user.id


        const user = await User.findById(userId).select('-password');
    
        if(!user){

    return res.status(404).json({ success: false, message: "User not found" });      

}

res.status(200).json({
      success: true,
      user
    });


    }catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
}

// وظيفة تعديل الملف الشخصي
const updateUserProfile = async (req, res) => {
  try {
    // 1. بندور على اليوزر بالـ ID اللي جاي من التوكن (عن طريق حارس الأمن)
    const user = await User.findById(req.user.id);

    if (user) {
      // 2. تحديث البيانات: لو اليوزر باعت اسم جديد هنحطه، لو مش باعت هنخلي القديم زي ما هو
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // 3. تحديث الباسورد (لو اليوزر طلب تغييره)
      if (req.body.password) {
        if (req.body.password.length < 8) {
          return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }
        // لازم نشفر الباسورد الجديد قبل ما نحفظه
        const salt = await bcrypt.genSalt(8);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      // 4. حفظ التعديلات في الداتا بيز
      const updatedUser = await user.save();

      // 5. الرد بالبيانات الجديدة (من غير الباسورد)
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          type: updatedUser.type
        }
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};


// وظيفة إضافة عنوان جديد للمستخدم
const addAddress = async (req, res) => {
  try {
    const { newAddress } = req.body;
    
    if (!newAddress) {
      return res.status(400).json({ success: false, message: "Please provide an address" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // إضافة العنوان الجديد للمصفوفة
    user.address.push(newAddress);
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Address added successfully", 
      addresses: user.address 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error: error.message });
  }
};


// وظيفة حذف عنوان من قائمة المستخدم
const removeAddress = async (req, res) => {
  try {
    // الفرونت إند هيبعت العنوان اللي عايز يمسحه
    const { addressToRemove } = req.body; 

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // فلترة المصفوفة عشان نشيل العنوان المطلوب
    user.address = user.address.filter(addr => addr !== addressToRemove);
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Address removed successfully", 
      addresses: user.address 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing address', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addAddress,removeAddress
};