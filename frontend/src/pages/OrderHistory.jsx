import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const navigate = useNavigate();

  // بيانات الطلب من الداتا بيز
  const order = {
    id: "#ORD-9921",
    date: "May 8, 2026",
    total: 450,
    status: "Preparing" // جربي تغيري الحالة هنا
  };

  const steps = [
    { label: 'Pending', icon: 'fa-hourglass-start', step: 1 },
    { label: 'Confirmed', icon: 'fa-clipboard-check', step: 2 },
    { label: 'Preparing', icon: 'fa-fire-burner', step: 3 },
    { label: 'Out for Delivery', icon: 'fa-motorcycle', step: 4 },
    { label: 'Delivered', icon: 'fa-house-chimney-check', step: 5 }
  ];

  const currentStepNumber = steps.find(s => s.label === order.status)?.step || 1;
  const progressHeight = `${((currentStepNumber - 1) / (steps.length - 1)) * 100}%`;

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

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)', padding: '80px 20px', color: 'white', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '900' }}>Order Tracking</h1>
      </div>

      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg p-5" style={{ borderRadius: '40px', backgroundColor: '#ffffff' }}>
              
              <div className="mb-5 text-center">
                <h2 className="fw-bold mb-2" style={{ fontSize: '2.5rem' }}>Order {order.id}</h2>
                <p className="text-muted fs-5">Placed on: {order.date}</p>
                <h2 className="fw-bold mt-3" style={{ color: '#ff4757', fontSize: '3rem' }}>{order.total} EGP</h2>
              </div>

              {/* حاوية التتبع - تم تعديلها لتكون "مسطرة" */}
              <div style={{ 
                position: 'relative',
                width: 'max-content', /* هذا التعديل يضمن بقاء المحتوى كتلة واحدة متماسكة */
                margin: '0 auto', /* لتوسيط الكتلة بالكامل في منتصف الكارت */
                padding: '10px 0',
                textAlign: 'left' /* لضمان بدء الكلمات من نفس النقطة */
              }}>
                
                {/* الخط العمودي المتصل */}
                <div style={{
                  position: 'absolute',
                  top: '30px',    /* نصف ارتفاع الدائرة الأولى (60/2) */
                  bottom: '30px', /* نصف ارتفاع الدائرة الأخيرة (60/2) */
                  left: '27px',   /* مركز الدائرة (30px) ناقص نصف سمك الخط (3px) = 27px */
                  width: '6px',
                  backgroundColor: '#eee',
                  zIndex: '1',
                  borderRadius: '10px'
                }}>
                   {/* الخط الأحمر المتحرك */}
                   <div style={{
                     width: '100%',
                     height: progressHeight,
                     backgroundColor: '#ff4757',
                     transition: 'height 1s ease',
                     borderRadius: '10px'
                   }}></div>
                </div>

                {/* الخطوات */}
                {steps.map((s, index) => (
                  <div key={index} style={{ 
                    position: 'relative',
                    zIndex: '2', 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    gap: '25px', /* المسافة الثابتة والمثالية بين الدائرة والكلمة */
                    marginBottom: index !== steps.length - 1 ? '40px' : '0'
                  }}>
                    
                    {/* الدائرة المتصلة بقوة بالخط */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: currentStepNumber >= s.step ? '#ff4757' : '#fff',
                      border: `4px solid ${currentStepNumber >= s.step ? '#ff4757' : '#eee'}`,
                      color: currentStepNumber >= s.step ? '#fff' : '#ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      boxShadow: currentStepNumber >= s.step ? '0 5px 15px rgba(255, 71, 87, 0.3)' : 'none',
                      transition: '0.4s',
                      flexShrink: 0 /* يمنع الدائرة من الانكماش */
                    }}>
                      <i className={`fa-solid ${s.icon}`}></i>
                    </div>

                    {/* الكلمة بجانب الدائرة */}
                    <h4 className="fw-bold mb-0" style={{ 
                      color: currentStepNumber >= s.step ? '#ff4757' : '#ccc',
                      fontSize: '1.4rem',
                      whiteSpace: 'nowrap'
                    }}>
                      {s.label}
                    </h4>
                  </div>
                ))}
              </div>

              <button 
                className="btn btn-danger btn-lg px-5 py-3 mt-5 shadow" 
                style={{ borderRadius: '20px', backgroundColor: '#ff4757', border: 'none', fontWeight: 'bold' }} 
                onClick={() => navigate('/')}
              >
                Back to Home
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;