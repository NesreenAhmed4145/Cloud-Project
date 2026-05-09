import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // عشان نعرف الـ ID بتاع الطيار
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- start menna: تعديل جلب الطلبات المتاحة للطيار ---
  const fetchOrders = async () => {
    try {
      // بنادي على الـ Gateway بورت 8000 والمسار اللي عملناه للطلبات المتاحة
      const response = await axios.get('http://localhost:8000/api/orders/available');
      setDeliveries(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching available orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  // دالة استلام الأوردر (Assign)
  const handlePickUp = async (orderId) => {
    try {
      // بنبعت طلب ربط الطيار بالأوردر
      await axios.patch(`http://localhost:8000/api/orders/assign`, {
        orderId: orderId,
        deliveryId: user.id
      });
      alert("Order assigned to you! Go pick it up 🚀");
      fetchOrders(); // تحديث القائمة
    } catch (error) {
      console.error("Error picking up order:", error);
    }
  };

  // دالة إتمام التوصيل
  const handleDeliver = async (orderId) => {
    try {
      await axios.patch(`http://localhost:8000/api/orders/${orderId}/status`, { 
        status: 'Delivered' 
      });
      alert(`Order delivered! Good job Captain 🎉`);
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  // --- end menna ---

  return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', direction: 'ltr', paddingBottom: '50px' }}>
      {/* الـ Header بتاعك الجميل زي ما هو */}
      <div style={{ background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)', padding: '60px 20px', color: 'white', textAlign: 'center', marginBottom: '50px', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900' }}>
          <i className="fa-solid fa-motorcycle me-3"></i> 
          Delivery Portal
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: '0.9' }}>Pick up orders and earn money!</p>
      </div>

      <div className="container">
        {loading ? (
          <div className="text-center mt-5"><h3 className="text-muted"><i className="fa-solid fa-spinner fa-spin me-2"></i> Loading...</h3></div>
        ) : deliveries.length === 0 ? (
          <div className="text-center mt-5"><h2>No orders ready for pickup! 🏖️</h2></div>
        ) : (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {deliveries.map((order) => (
              <div key={order._id} className="card border-0 shadow-lg mb-4" style={{ borderRadius: '25px' }}>
                <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
                  <h5 className="m-0">Order #{order._id.substring(0, 8)}</h5>
                  <span className="badge bg-warning text-dark">{order.status}</span>
                </div>
                
                <div className="card-body p-4">
                  <p><strong><i className="fa-solid fa-location-dot me-2 text-danger"></i>Address:</strong> {order.deliveryAddress}</p>
                  <p><strong><i className="fa-solid fa-money-bill me-2 text-success"></i>Total:</strong> {order.totalPrice} EGP</p>
                  
                  <hr />
                  
                  {/* زرار ذكي: لو الحالة جاهزة يستلمها، لو استلمها يوصلها */}
                  {order.status === 'Ready for Pickup' ? (
                    <button onClick={() => handlePickUp(order._id)} className="btn btn-primary w-100 py-3 fw-bold" style={{ borderRadius: '15px' }}>
                      Pick Up Order 🎒
                    </button>
                  ) : (
                    <button onClick={() => handleDeliver(order._id)} className="btn btn-success w-100 py-3 fw-bold" style={{ borderRadius: '15px' }}>
                      Mark as Delivered ✅
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;