import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // سحب بيانات اليوزر اللي عامل login
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- start menna: logic لربط الباك إند وتحديث الحالة تلقائياً ---
  const fetchLatestOrder = async () => {
    try {
      // بنكلم الـ Gateway على بورت 8000
      const response = await axios.get(`http://localhost:8000/api/orders/user/${user.id}`);
      if (response.data && response.data.length > 0) {
        // بناخد أول أوردر في القائمة (الأحدث)
        setOrder(response.data[0]);
      }
    } catch (err) {
      console.error("Error fetching order status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchLatestOrder();
      
      // التحديث التلقائي كل 10 ثواني (Polling)
      const interval = setInterval(fetchLatestOrder, 10000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);
  // --- end menna ---

  // الخطوات المحدثة لتشمل الـ Delivery والـ Restaurant
  const steps = [
    { label: 'Pending', icon: 'fa-hourglass-start', step: 1 },
    { label: 'Confirmed', icon: 'fa-clipboard-check', step: 2 },
    { label: 'Preparing', icon: 'fa-fire-burner', step: 3 },
    { label: 'Ready for Pickup', icon: 'fa-box', step: 4 },
    { label: 'Out for Delivery', icon: 'fa-motorcycle', step: 5 },
    { label: 'Delivered', icon: 'fa-house-chimney-check', step: 6 }
  ];

  // حساب مكان الخط الأحمر بناءً على الحالة اللي جاية من السيرفر
  const currentStepNumber = steps.find(s => s.label === order?.status)?.step || 1;
  const progressHeight = `${((currentStepNumber - 1) / (steps.length - 1)) * 100}%`;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="mt-3 fs-4">Checking your order status... 🍕</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-5 mt-5">
        <h2 className="fw-bold">You haven't placed any orders yet!</h2>
        <button className="btn btn-danger mt-3 px-5 py-3" style={{ borderRadius: '15px' }} onClick={() => navigate('/')}>
          Explore Restaurants 🍔
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', direction: 'ltr', textAlign: 'center', position: 'relative' }}>
      
      {/* زر العودة */}
      <button 
        onClick={() => navigate('/')} 
        style={{ position: 'absolute', top: '30px', left: '30px', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ffffff', border: '2px solid #ff4757', color: '#ff4757', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: '10', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>

      {/* Header الملون بتنسيق منة الشريف */}
      <div style={{ background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)', padding: '80px 20px', color: 'white', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '900' }}>Order Tracking</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>See where your food is right now!</p>
      </div>

      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg p-5" style={{ borderRadius: '40px', backgroundColor: '#ffffff' }}>
              
              <div className="mb-5 text-center">
                <h2 className="fw-bold mb-2" style={{ fontSize: '2.5rem' }}>Order #{order._id.substring(0, 8)}</h2>
                <p className="text-muted fs-5">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                <h2 className="fw-bold mt-3" style={{ color: '#ff4757', fontSize: '3rem' }}>{order.totalPrice} EGP</h2>
              </div>

              {/* حتة الـ Tracker العمودي الجميل */}
              <div style={{ position: 'relative', width: 'max-content', margin: '0 auto', padding: '10px 0', textAlign: 'left' }}>
                
                {/* الخط الرمادي الأساسي */}
                <div style={{
                  position: 'absolute', top: '30px', bottom: '30px', left: '27px', width: '6px',
                  backgroundColor: '#eee', zIndex: '1', borderRadius: '10px'
                }}>
                    {/* الخط الأحمر اللي بيتحرك مع الـ Status */}
                    <div style={{
                      width: '100%', height: progressHeight, backgroundColor: '#ff4757',
                      transition: 'height 1s ease', borderRadius: '10px'
                    }}></div>
                </div>

                {/* رسم الخطوات بناءً على المصفوفة */}
                {steps.map((s, index) => (
                  <div key={index} style={{ 
                    position: 'relative', zIndex: '2', display: 'flex', flexDirection: 'row', 
                    alignItems: 'center', gap: '25px', marginBottom: index !== steps.length - 1 ? '40px' : '0'
                  }}>
                    
                    <div style={{
                      width: '60px', height: '60px', borderRadius: '50%',
                      backgroundColor: currentStepNumber >= s.step ? '#ff4757' : '#fff',
                      border: `4px solid ${currentStepNumber >= s.step ? '#ff4757' : '#eee'}`,
                      color: currentStepNumber >= s.step ? '#fff' : '#ccc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.4rem', boxShadow: currentStepNumber >= s.step ? '0 5px 15px rgba(255, 71, 87, 0.3)' : 'none',
                      transition: '0.4s', flexShrink: 0
                    }}>
                      <i className={`fa-solid ${s.icon}`}></i>
                    </div>

                    <h4 className="fw-bold mb-0" style={{ 
                      color: currentStepNumber >= s.step ? '#ff4757' : '#ccc',
                      fontSize: '1.4rem', whiteSpace: 'nowrap'
                    }}>
                      {s.label}
                    </h4>
                  </div>
                ))}
              </div>

              <button 
                className="btn btn-outline-danger btn-lg px-5 py-3 mt-5 shadow-sm" 
                style={{ borderRadius: '20px', fontWeight: 'bold' }} 
                onClick={() => navigate('/')}
              >
                Back to Explore
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;