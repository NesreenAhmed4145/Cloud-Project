import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Menu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    // جلب بيانات المطعم المختار بناءً على الـ ID من الرابط
    axios.get(`http://localhost:8000/api/restaurants/${id}`)
      .then(res => setRestaurant(res.data))
      .catch(err => console.error("Error fetching menu:", err));
  }, [id]);

  if (!restaurant) return (
    <div className="text-center py-5">
      <div className="spinner-border text-danger" role="status"></div>
      <p className="mt-3 fs-4">Loading Delicious Menu...</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', direction: 'ltr', textAlign: 'center', position: 'relative' }}>
      
      {/* زرار الـ Back - دائرة بيضاء بسهم أحمر */}
      <button 
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: '2px solid #ff4757',
          color: '#ff4757',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: '10',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>

      {/* Header Section - اسم المطعم وكلمة Menu */}
      <div style={{ 
        background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)', 
        padding: '100px 20px', 
        color: 'white',
        marginBottom: '60px'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '5rem', fontWeight: '900', marginBottom: '10px' }}>
            {restaurant.name}
          </h1>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '8px' }}>
            Menu
          </h2>
        </div>
      </div>

      <div className="container-fluid px-5 pb-5">
        {/* عرض الأصناف: 3 في الصف مع مسافات g-5 */}
        <div className="row g-5 justify-content-center">
          {restaurant.menu.map((item) => (
            <div key={item._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm transition-card" style={{ borderRadius: '35px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
                
                {/* صورة الصنف من Unsplash تعتمد على اسم الأكلة */}
                <div style={{ height: '230px', overflow: 'hidden' }}>
                   <img 
                      src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80`} 
                      alt={item.itemName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                <div className="card-body p-5 text-center">
                  <h3 className="fw-bold mb-3" style={{ fontSize: '1.8rem' }}>{item.itemName}</h3>
                  <p className="text-muted mb-4" style={{ fontSize: '1.2rem' }}>{item.category || 'Main Course'}</p>
                  <h2 className="text-danger fw-bold mb-5" style={{ fontSize: '2.2rem' }}>{item.price} EGP</h2>
                  
                  {/* زرار الإضافة للسلة */}
                  <button 
                    className="btn btn-danger w-100 py-3 fw-bold shadow" 
                    style={{ 
                        borderRadius: '18px', 
                        fontSize: '1.3rem', 
                        backgroundColor: '#ff4757', 
                        border: 'none'
                    }}
                    onClick={() => {
                        addToCart({ 
                            id: item._id, 
                            name: item.itemName, 
                            price: item.price,
                            // start menna
                            restaurantId: id,
                            //end menna
                            quantity: 1 
                        });
                        alert(`${item.itemName} added to your cart! 🛒`);
                    }}
                  >
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* زرار الانتقال لصفحة السلة (My Cart) */}
        <div className="text-center mt-5 pt-5">
            <button 
              className="btn btn-dark btn-lg px-5 py-4 shadow-lg fw-bold" 
              onClick={() => navigate('/cart')} // تم التعديل للذهاب لصفحة /cart
              style={{ borderRadius: '20px', fontSize: '1.6rem', minWidth: '350px' }}
            >
              View My Cart 🛒
            </button>
        </div>
      </div>

      <style>{`
        .transition-card {
          transition: all 0.4s ease;
        }
        .transition-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 15px 35px rgba(255, 71, 87, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default Menu;