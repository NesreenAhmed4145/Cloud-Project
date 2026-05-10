const Order = require('../models/Order');

// 1. إنشاء طلب جديد
exports.createOrder = async (req, res) => {
    try {
        const { restaurantId, items, totalPrice, userId, deliveryAddress } = req.body;

        const newOrder = new Order({
            userId: userId || "guest_user",
            restaurantId,
            items,
            totalPrice, // 👈 وحدنا الاسم هنا عشان يطابق الـ Schema
            deliveryAddress,
            status: 'Pending'
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. عرض طلبات المطعم (النسخة المتظبطة)
exports.getRestaurantOrders = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        console.log("📩 Request for Restaurant ID:", restaurantId);

        // بنحول الـ ID لـ String عشان المونجو ميزعلش
        const orders = await Order.find({ restaurantId: restaurantId.toString() }).sort({ createdAt: -1 });

        console.log(`✅ Found ${orders.length} orders`);
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error", error: err.message });
    }
};

// ... باقي الدوال (assignDelivery, updateOrderStatus, getUserOrders) كمليهم عادي بنفس الطريقة

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

// 3. عرض الطلبات المتاحة للتوصيل (للدليفري)
exports.getAvailableOrders = async (req, res) => {
    try {
        console.log("🛵 Fetching available orders for delivery...");
        
        // هنجيب الأوردرات اللي حالتها "Ready for Pickup" ومفيش طيار استلمها (deliveryId: null)
        const orders = await Order.find({ 
            status: 'Ready for Pickup',
            deliveryId: null 
        }).sort({ createdAt: -1 });

        console.log(`✅ Found ${orders.length} orders ready for delivery`);
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching available orders", error: err.message });
    }
};