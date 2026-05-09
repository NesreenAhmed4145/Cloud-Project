const Order = require('../models/Order');

// 1. إنشاء طلب جديد (الزبون اللي بيعمله)
exports.createOrder = async (req, res) => {
    try {
        // بنضيف التعديلات الجديدة زي deliveryAddress و default status
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ message: "Error creating order", error: err });
    }
};

// 2. عرض طلبات المطعم (لصاحب المطعم)
exports.getRestaurantOrders = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        // بنجيب الأوردرات الخاصة بالمطعم ده ومرتبة من الأحدث
        const orders = await Order.find({ restaurantId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching restaurant orders", error: err });
    }
};

// 3. عرض الطلبات المتاحة للتوصيل (للدليفري)
// دي بتجيب الأوردرات اللي حالتها "Ready for Pickup" ومفيش طيار خدها لسه
exports.getAvailableOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 
            status: 'Ready for Pickup', 
            deliveryId: null 
        });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching available orders", error: err });
    }
};

// 4. استلام الطيار للأوردر (Assign Delivery)
exports.assignDelivery = async (req, res) => {
    try {
        const { orderId, deliveryId } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { 
                $set: { 
                    deliveryId: deliveryId, 
                    status: 'Out for Delivery' 
                } 
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: "Error assigning delivery", error: err });
    }
};

// 5. تحديث الحالة (للكل: مطعم، دليفري)
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
        res.status(500).json({ message: "Error updating status", error: err });
    }
};

// 6. عرض طلبات الزبون (للتتبع Tracking)
exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user orders", error: err });
    }
};