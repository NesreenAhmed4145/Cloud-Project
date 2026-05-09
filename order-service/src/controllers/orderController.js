const Order = require('../models/Order');

// إنشاء طلب جديد
exports.createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ message: "Error creating order", error: err });
    }
};

// عرض طلبات مستخدم معين
exports.getUserOrders = async (req, res) => {
    try {
        let orders;
        // لو باعتين userId في اللينك، فلتر بيه.. لو مش باعتين، هات كله
        if (req.params.userId) {
            orders = await Order.find({ userId: req.params.userId });
        } else {
            orders = await Order.find(); // هات كل الأوردرات اللي في الداتابيز
        }
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders", error: err });
    }
};

// تحديث حالة الطلب (مثلاً من Pending لـ Delivered)
exports.updateOrderStatus = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, // بنجيب الأوردر بالـ ID بتاعه
            { $set: { status: req.body.status } }, // بنحدث الـ status بس
            { new: true } // عشان يرجعلك البيانات بعد التعديل
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: "Error updating status", error: err });
    }
};