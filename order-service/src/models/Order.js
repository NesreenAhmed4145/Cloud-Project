const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    restaurantId: { type: String, required: true },
    // 1. ضيفنا ده عشان نعرف مين الطيار اللي استلم الأوردر
    deliveryId: { type: String, default: null }, 
    items: [{
        name: String,
        quantity: Number,
        price: Number
    }],
    totalPrice: { type: Number},
    // 2. ضيفنا الـ Address عشان الدليفري والـ Order Tracking
    deliveryAddress: { type: String}, 
    status: { 
        type: String, 
        // 3. زودنا حالة 'Ready for Pickup' دي اللي الدليفري بيشوفها عشان يوافق يوصل
        enum: ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Pending' 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);