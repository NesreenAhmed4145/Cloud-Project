const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    location: { type: String, required: true },
    contact: {
        phone: String,
        email: String
    },
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true // ده الـ ID اللي جاي من الـ user-service
    },
    address: String,
    
    // 👇 الإضافات الجديدة عشان الديزاين
    imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' }, // صورة افتراضية لو مدخلش صورة
    deliveryTime: { type: Number, default: 30 }, // وقت التوصيل بالدقائق
    
    isOpen: { type: Boolean, default: true },
    menu: [{
        itemName: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, default: "Main" },
        available: { type: Boolean, default: true },
        itemImage: { type: String } // 👈 ضفتلك دي كمان لو حابة تحطي صورة لكل وجبة بعدين
    }]
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);