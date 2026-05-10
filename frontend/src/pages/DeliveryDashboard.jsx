import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  // قسمنا الـ State لاتنين عشان نفصل الداتا
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State للتحكم في الـ UI (التبويبات)
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'myDeliveries'

  // دالة بتجيب الداتا كلها (المتاح + عهدة الطيار)
  const fetchData = async () => {
    try {
      const driverId = user?._id || user?.id;
      if (!driverId) return;

      // 1. جلب المتاح
      const availResponse = await axios.get('http://localhost:8000/api/orders/available');
      setAvailableOrders(availResponse.data);

      // 2. جلب الأوردرات اللي الطيار ده استلمها
      const myResponse = await axios.get(`http://localhost:8000/api/orders/delivery/${driverId}`);
      setMyDeliveries(myResponse.data);

      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // دالة استلام الأوردر
  const handlePickUp = async (orderId) => {
    try {
      const driverId = user?._id || user?.id;
      await axios.patch(`http://localhost:8000/api/orders/assign`, {
        orderId: orderId,
        deliveryId: driverId
      });
      alert("Order assigned to you! Go pick it up 🚀");
      
      // بننقل الطيار أوتوماتيك لتابة "أوردراتي" وبنحدث الداتا
      setActiveTab('myDeliveries');
      fetchData(); 
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
      fetchData(); // تحديث القائمة
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', direction: 'ltr', paddingBottom: '50px' }}>
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)', padding: '60px 20px', color: 'white', textAlign: 'center', marginBottom: '30px', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900' }}>
          <i className="fa-solid fa-motorcycle me-3"></i> 
          Delivery Portal
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: '0.9' }}>Pick up orders and earn money!</p>
      </div>

      <div className="container">
        
        {/* Toggle Tabs (تصميم شيك للتبديل بين القوائم) */}
        <div className="d-flex justify-content-center mb-5">
          <div className="btn-group shadow-sm" style={{ borderRadius: '20px', backgroundColor: 'white', padding: '5px' }}>
            <button 
              className={`btn fw-bold px-4 py-2 ${activeTab === 'available' ? 'btn-danger' : 'btn-light text-muted'}`}
              style={{ borderRadius: '15px', transition: '0.3s' }}
              onClick={() => setActiveTab('available')}
            >
              Available Orders 🆕
            </button>
            <button 
              className={`btn fw-bold px-4 py-2 ${activeTab === 'myDeliveries' ? 'btn-danger' : 'btn-light text-muted'}`}
              style={{ borderRadius: '15px', transition: '0.3s' }}
              onClick={() => setActiveTab('myDeliveries')}
            >
              My Deliveries 🛵
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center mt-5"><h3 className="text-muted"><i className="fa-solid fa-spinner fa-spin me-2"></i> Loading Data...</h3></div>
        ) : (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            
            {/* عرض الأوردرات المتاحة */}
            {activeTab === 'available' && (
              <>
                {availableOrders.length === 0 ? (
                  <div className="text-center mt-5"><h4>No orders ready for pickup! 🏖️</h4></div>
                ) : (
                  availableOrders.map((order) => (
                    <div key={order._id} className="card border-0 shadow-lg mb-4" style={{ borderRadius: '25px' }}>
                      <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
                        <h5 className="m-0">Order #{order._id.substring(0, 8)}</h5>
                        <span className="badge bg-warning text-dark">{order.status}</span>
                      </div>
                      <div className="card-body p-4">
                        <p><strong><i className="fa-solid fa-location-dot me-2 text-danger"></i>Address:</strong> {order.deliveryAddress || 'Address not provided'}</p>
                        <p><strong><i className="fa-solid fa-money-bill me-2 text-success"></i>Total:</strong> {order.totalPrice} EGP</p>
                        <hr />
                        <button onClick={() => handlePickUp(order._id)} className="btn btn-primary w-100 py-3 fw-bold" style={{ borderRadius: '15px' }}>
                          Pick Up Order 🎒
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* عرض عهدة الطيار الحالية */}
            {activeTab === 'myDeliveries' && (
              <>
                {myDeliveries.length === 0 ? (
                  <div className="text-center mt-5"><h4>You have no active deliveries right now.</h4></div>
                ) : (
                  myDeliveries.map((order) => (
                    <div key={order._id} className="card border-0 shadow-lg mb-4" style={{ borderRadius: '25px', borderLeft: '5px solid #28a745' }}>
                      <div className="bg-light p-3 d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
                        <h5 className="m-0 text-dark">Order #{order._id.substring(0, 8)}</h5>
                        <span className="badge bg-info text-dark">Out for Delivery 🛵</span>
                      </div>
                      <div className="card-body p-4">
                        <p><strong><i className="fa-solid fa-location-dot me-2 text-danger"></i>Deliver to:</strong> {order.deliveryAddress || 'Address not provided'}</p>
                        <p><strong><i className="fa-solid fa-money-bill me-2 text-success"></i>Collect:</strong> {order.totalPrice} EGP</p>
                        <hr />
                        <button onClick={() => handleDeliver(order._id)} className="btn btn-success w-100 py-3 fw-bold shadow-sm" style={{ borderRadius: '15px' }}>
                          Mark as Delivered ✅
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;