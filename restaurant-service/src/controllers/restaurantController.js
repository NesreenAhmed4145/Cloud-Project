const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose'); // 👈 ضيفي السطر ده فوق خالص



// 1. عرض كل المطاعم (Customer)
exports.getAllRestaurants = async (req, res) => {
    try {
        const { cuisine, location } = req.query;
        let query = {};
        if (cuisine) query.cuisine = new RegExp(cuisine, 'i');
        if (location) query.location = new RegExp(location, 'i');
        
        const restaurants = await Restaurant.find(query);
        res.status(200).json(restaurants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. تفاصيل مطعم معين (Customer)
exports.getRestaurantDetails = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
        res.status(200).json(restaurant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. إضافة مطعم جديد (Admin)
// 3. إضافة مطعم جديد (Admin)
exports.createRestaurant = async (req, res) => {
  try {
    // 1. هنسحب كل الداتا اللي ضفناها في الفورم بتاع الفرونت إند
    const { 
      name, 
      cuisine, 
      address, 
      deliveryTime, 
      imageUrl, 
      menu 
    } = req.body;

    // 2. هنكريت المطعم ونبعتله كل الداتا دي
    const restaurant = await Restaurant.create({
      name,
      cuisine,
      location: address, // خلينا الـ location ياخد نفس قيمة الـ address عشان الداتا بيز متزعلش
      address,
      deliveryTime,
      imageUrl, // 👈 رابط الصورة اللي هيتخزن
      menu,
      ownerId: req.user.id // سحبنا الـ ID من التوكن
    });

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// 4. إدارة المنيو (Admin: Update/Toggle Availability)
exports.updateMenuItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const updateData = req.body; // { price, available, itemName }

        const restaurant = await Restaurant.findOneAndUpdate(
            { "_id": req.params.id, "menu._id": itemId },
            { "$set": { 
                "menu.$.available": updateData.available,
                "menu.$.price": updateData.price,
                "menu.$.itemName": updateData.itemName
            }},
            { new: true }
        );
        res.status(200).json(restaurant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 5. التحقق الداخلي (Internal: Order Service)
exports.validateItems = async (req, res) => {
    try {
        const { restaurantId, items } = req.body;
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) return res.status(404).json({ valid: false, message: "Restaurant not found" });

        let totalPrice = 0;
        for (let itemReq of items) {
            const menuItem = restaurant.menu.id(itemReq.id);
            
            // لو الوجبة مش موجودة أو مش متاحة (available: false)
            if (!menuItem || !menuItem.available) {
                return res.json({ valid: false, message: `Item ${itemReq.id} is not available` });
            }
            
            totalPrice += menuItem.price * itemReq.quantity;
        }

        res.json({ valid: true, totalPrice });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// جلب بيانات المطعم عن طريق صاحب المطعم (Owner)
exports.getRestaurantByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;
        
        // تحويل الـ ID لـ ObjectId عشان يطابق الـ Schema بالظبط
        const restaurant = await Restaurant.findOne({ 
            ownerId: new mongoose.Types.ObjectId(ownerId) 
        });
        
        if (!restaurant) {
            return res.status(404).json({ message: "No restaurant found for this owner" });
        }
        
        res.status(200).json(restaurant);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};