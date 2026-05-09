import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  
  const total = cartItems ? cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    paymentMethod: 'card' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data to backend:", formData);
    navigate('/order-history'); 
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', direction: 'ltr', position: 'relative' }}>
      
      {/* زر العودة */}
      <button 
        onClick={() => navigate('/cart')} 
        style={{ position: 'absolute', top: '30px', left: '30px', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ffffff', border: '2px solid #ff4757', color: '#ff4757', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: '10', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)', padding: '80px 20px', color: 'white', textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '900' }}>Checkout</h1>
        <p style={{ fontSize: '1.5rem', opacity: '0.9' }}>Finalize your delicious order</p>
      </div>

      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg p-5" style={{ borderRadius: '40px', backgroundColor: '#ffffff' }}>
              
              <form onSubmit={handleSubmit}>
                
                {/* الحاوية المسنترة */}
                <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                  
                  {/* بيانات التوصيل */}
                  <h3 className="fw-bold mb-4 text-center" style={{ color: '#2d3436', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>Delivery Details</h3>
                  
                  <div className="mb-4">
                    <label className="form-label fw-bold text-muted w-100 text-center" style={{ display: 'block' }}>Full Name</label>
                    <input type="text" className="form-control form-control-lg bg-light border text-center mx-auto" name="fullName" value={formData.fullName} onChange={handleChange} required style={{ borderRadius: '15px', padding: '15px', width: '100%' }} />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-muted w-100 text-center" style={{ display: 'block' }}>Delivery Address</label>
                    <input type="text" className="form-control form-control-lg bg-light border text-center mx-auto" name="address" value={formData.address} onChange={handleChange} required style={{ borderRadius: '15px', padding: '15px', width: '100%' }} />
                  </div>

                  <div className="mb-5">
                    <label className="form-label fw-bold text-muted w-100 text-center" style={{ display: 'block' }}>Phone Number</label>
                    <input type="tel" className="form-control form-control-lg bg-light border text-center mx-auto" name="phone" value={formData.phone} onChange={handleChange} required style={{ borderRadius: '15px', padding: '15px', width: '100%' }} />
                  </div>

                  {/* طريقة الدفع */}
                  <h3 className="fw-bold mb-4 mt-5 text-center" style={{ color: '#2d3436', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>Payment Method</h3>
                  
                  <div className="mb-5">
                    <select 
                      className="form-select form-select-lg bg-light border fw-bold mx-auto text-center" 
                      name="paymentMethod" 
                      value={formData.paymentMethod} 
                      onChange={handleChange} 
                      style={{ borderRadius: '15px', padding: '15px', cursor: 'pointer', color: '#ff4757', width: '100%', textAlignLast: 'center' }}
                    >
                      <option value="card">Credit / Debit Card</option>
                      <option value="fawry">Fawry</option>
                      <option value="vodafone_cash">Vodafone Cash</option>
                    </select>
                  </div>

                  {/* المجموع النهائي */}
                  <div style={{ marginTop: '40px', width: '100%', display: 'flex', justifyContent: 'center', direction: 'ltr', borderTop: '2px dashed #eee', paddingTop: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: '15px' }}>
                      <h2 className="fw-bold m-0" style={{ fontSize: '2.5rem', color: '#2d3436' }}>Total:</h2>
                      <h2 className="fw-bold m-0" style={{ color: '#ff4757', fontSize: '3rem' }}>
                        {total} EGP
                      </h2>
                    </div>
                  </div>

                  {/* زرار التأكيد - تم توحيد الحجم والستايل مع الـ Inputs */}
                  <div className="mt-5">
                    <button 
                      type="submit" 
                      className="btn btn-danger fw-bold shadow-lg" 
                      style={{ 
                        borderRadius: '15px', // نفس لفة المربع بالظبط
                        padding: '15px', // نفس ارتفاع المربع بالظبط
                        width: '100%', // نفس العرض بالظبط
                        fontSize: '1.2rem', 
                        backgroundColor: '#ff4757', 
                        border: 'none', 
                        transition: '0.3s' 
                      }}>
                      Confirm Order
                    </button>
                  </div>

                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;