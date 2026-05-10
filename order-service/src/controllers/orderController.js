const Order = require('../models/Order');

// 1. إنشاء أوردر جديد
exports.createOrder = async (req, res) => {
    try {
        const { restaurantId, items, totalPrice, userId, deliveryAddress } = req.body;
        const newOrder = new Order({
            userId: userId || "guest_user",
            restaurantId,
            items,
            totalPrice,
            deliveryAddress,
            status: 'Pending'
        });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. عرض طلبات المطعم (للأدمين)
exports.getRestaurantOrders = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const orders = await Order.find({ restaurantId: restaurantId.toString() }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error", error: err.message });
    }
};

// 3. عرض الطلبات المتاحة (للدليفري)
exports.getAvailableOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 
            status: 'Ready for Pickup',
            deliveryId: null 
        }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching available orders", error: err.message });
    }
};

// 4. جلب عهدة الطيار الحالية (الدالة الجديدة اللي كانت ناقصة)
exports.getMyDeliveries = async (req, res) => {
    try {
        const { deliveryId } = req.params;
        const orders = await Order.find({ 
            deliveryId: deliveryId,
            status: 'Out for Delivery' 
        }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching my deliveries", error: err.message });
    }
};

// 5. استلام الطيار للأوردر
exports.assignDelivery = async (req, res) => {
    try {
        const { orderId, deliveryId } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: { deliveryId: deliveryId, status: 'Out for Delivery' } },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: "Error assigning delivery", error: err.message });
    }
};

// 6. تحديث حالة الأوردر (للعميل والمطعم)
exports.updateOrderStatus = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { status: req.body.status } },
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: "Error updating status", error: err.message });
    }
};

// 7. جلب طلبات الزبون (للتتبع)
exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user orders", error: err.message });
    }
};