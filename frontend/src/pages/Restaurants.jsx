import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/restaurants')
      .then(res => {
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching restaurants:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ backgroundColor: '#fdfdfd', minHeight: '100vh', direction: 'ltr' }}>
      
      {/* Header Section - منتصف الصفحة، كلام كبير، وألوان جذابة */}
      <div style={{ 
        background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)', 
        padding: '80px 20px', 
        color: 'white', 
        textAlign: 'center',
        marginBottom: '50px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <div className="container">
          <h1 style={{ 
            fontSize: '4.5rem', 
            fontWeight: '900', 
            marginBottom: '15px',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Restaurants
          </h1>
          <p style={{ 
            fontSize: '1.5rem', 
            fontWeight: '300', 
            maxWidth: '700px', 
            margin: '0 auto',
            opacity: '0.9'
          }}>
            Choose your favorite restaurant and order now
          </p>
        </div>
      </div>

      <div className="container-fluid px-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="mt-3 fs-4 text-muted">Loading your favorite spots...</p>
          </div>
        ) : (
          <div className="row g-4">
            {restaurants.map((res) => (
              <div key={res._id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm transition-card" style={{ borderRadius: '25px', overflow: 'hidden' }}>
                  
                  {/* صورة المطعم */}
                  <div style={{ position: 'relative', height: '250px' }}>
                    <img 
                      src={`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80`} 
                      alt={res.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '0', 
                      left: '0', 
                      right: '0', 
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', 
                      padding: '25px', 
                      color: 'white' 
                    }}>
                      <h2 className="m-0 fw-bold" style={{ fontSize: '1.8rem' }}>{res.name}</h2>
                    </div>
                  </div>

                  <div className="card-body p-4 text-center">
                    <div className="mb-3">
                      <span className="badge rounded-pill bg-danger px-3 py-2 me-2" style={{ fontSize: '0.9rem' }}>
                        {res.cuisine}
                      </span>
                      <span className="text-muted"><i className="bi bi-geo-alt"></i> {res.location}</span>
                    </div>
                    
                    {/* زرار الدخول للمنيو */}
                    <button 
                      className="btn btn-danger w-100 py-3 fw-bold" 
                      style={{ 
                        borderRadius: '15px', 
                        fontSize: '1.2rem',
                        boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)'
                      }}
                      onClick={() => navigate(`/restaurant/${res._id}`)}
                    >
                      View Menu Items
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* حركات الـ Hover بالـ CSS */}
      <style>{`
        .transition-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .transition-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default Restaurants;