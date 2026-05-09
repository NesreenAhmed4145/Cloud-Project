import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  // التعديل هنا: سنترة شاشة "الرجاء تسجيل الدخول" بالستايل المباشر
  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        width: '100%', 
        backgroundColor: '#f4f6f9' 
      }}>
        <i className="fa-solid fa-lock mb-3" style={{ fontSize: '4rem', color: '#ff4757', opacity: '0.5' }}></i>
        <h2 style={{ color: '#2d3436', fontWeight: 'bold', marginBottom: '20px' }}>Please login first...</h2>
        <button 
          onClick={() => navigate('/login')}
          style={{ 
            padding: '15px 40px', 
            backgroundColor: '#ff4757', 
            color: 'white', 
            border: 'none', 
            borderRadius: '15px', 
            fontSize: '1.2rem', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: '0.3s'
          }}
        >
          <i className="fa-solid fa-right-to-bracket me-2"></i> Go to Login
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', direction: 'ltr', paddingBottom: '50px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <button 
        onClick={() => navigate(-1)} 
        style={{ position: 'absolute', top: '30px', left: '30px', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ffffff', border: '2px solid #ff4757', color: '#ff4757', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: '10', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>

      <div style={{ width: '100%', background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)', padding: '80px 20px 100px', color: 'white', textAlign: 'center', borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900' }}>My Profile</h1>
      </div>

      <div style={{ width: '100%', maxWidth: '600px', margin: '-80px auto 0', padding: '0 20px', position: 'relative', zIndex: '5' }}>
        <div className="card border-0 shadow-lg" style={{ borderRadius: '25px', backgroundColor: '#ffffff', overflow: 'hidden' }}>
          
          <div className="text-center" style={{ marginTop: '30px' }}>
            <div style={{ width: '120px', height: '120px', backgroundColor: '#f4f6f9', borderRadius: '50%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', border: '5px solid #fff', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <i className={`fa-solid ${user.type === 'delivery' ? 'fa-motorcycle' : 'fa-user'} `} style={{ fontSize: '3rem', color: '#ff4757' }}></i>
            </div>
            <h2 className="fw-bold mt-3 mb-0" style={{ color: '#2d3436' }}>{user.name}</h2>
            <p className="text-muted fs-5 text-capitalize">{user.type}</p>
          </div>

          <div className="card-body p-4 p-md-5 text-center">
            
            <h5 className="fw-bold mx-auto mb-5" style={{ color: '#ff4757', borderBottom: '2px solid #eee', paddingBottom: '10px', width: 'fit-content' }}>
              <i className="fa-solid fa-address-card me-2"></i> Account Information
            </h5>
            
            <div className="mb-4">
              <i className="fa-solid fa-envelope fs-2 text-muted mb-2 d-block mx-auto"></i>
              <p className="text-muted mb-1 fs-6">Email</p>
              <h5 className="fw-bold m-0 text-dark">{user.email}</h5>
            </div>

            <div className="mb-5">
              <i className="fa-solid fa-phone fs-2 text-muted mb-2 d-block mx-auto"></i>
              <p className="text-muted mb-1 fs-6">Phone</p>
              <h5 className="fw-bold m-0 text-dark">{user.phone || 'Not provided'}</h5> 
            </div>

            {user.type === 'customer' && (
              <div className="mt-5">
                <h5 className="fw-bold mx-auto mb-4" style={{ color: '#ff4757', borderBottom: '2px solid #eee', paddingBottom: '10px', width: 'fit-content' }}>
                  <i className="fa-solid fa-location-dot me-2"></i> Saved Addresses
                </h5>
                
                {user.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((address, index) => (
                    <div key={index} className="p-4 mb-3 bg-light rounded-4 d-flex flex-column align-items-center justify-content-center">
                      <i className="fa-solid fa-house-chimney text-secondary fs-3 mb-2"></i>
                      <span className="fw-bold text-dark text-center">{address}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No addresses saved yet.</p>
                )}

                <button 
                  onClick={() => navigate('/order-history')}
                  className="btn btn-outline-danger w-100 fw-bold mt-4" 
                  style={{ borderRadius: '15px', padding: '15px', borderWidth: '2px', fontSize: '1.2rem' }}
                >
                  <i className="fa-solid fa-clock-rotate-left me-2"></i> View My Orders
                </button>
              </div>
            )}

            {user.type === 'delivery' && (
              <div className="mt-5">
                <h5 className="fw-bold mx-auto mb-4" style={{ color: '#ff4757', borderBottom: '2px solid #eee', paddingBottom: '10px', width: 'fit-content' }}>
                  <i className="fa-solid fa-chart-simple me-2"></i> Delivery Stats
                </h5>
                
                <div className="row justify-content-center mb-4">
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-4 d-flex flex-column align-items-center">
                      <i className="fa-solid fa-box-open fs-3 text-secondary mb-2"></i>
                      <h3 className="fw-bold text-dark m-0">{user.deliveriesCompleted || 0}</h3>
                      <p className="text-muted m-0 fs-6">Deliveries</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-4 d-flex flex-column align-items-center">
                      <i className="fa-solid fa-star text-warning fs-3 mb-2"></i>
                      <h3 className="fw-bold text-dark m-0">{user.rating || 'N/A'}</h3>
                      <p className="text-muted m-0 fs-6">Rating</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 mb-3 bg-light rounded-4 d-flex flex-column align-items-center">
                  <i className="fa-solid fa-motorcycle text-secondary fs-3 mb-2"></i>
                  <span className="fw-bold text-dark text-center">{user.vehicle || 'Standard Vehicle'}</span>
                </div>

                <button 
                  onClick={() => navigate('/delivery/dashboard')}
                  className="btn btn-outline-danger w-100 fw-bold mt-4" 
                  style={{ borderRadius: '15px', padding: '15px', borderWidth: '2px', fontSize: '1.2rem' }}
                >
                  <i className="fa-solid fa-route me-2"></i> Go to Dashboard
                </button>
              </div>
            )}

            <div className="mt-5 pt-4" style={{ borderTop: '2px dashed #eee' }}>
              <button 
                onClick={handleLogout}
                className="btn btn-danger w-100 fw-bold shadow-lg" 
                style={{ borderRadius: '15px', padding: '15px', backgroundColor: '#ff4757', border: 'none', transition: '0.3s', fontSize: '1.2rem' }}
              >
                <i className="fa-solid fa-right-from-bracket me-2"></i> Logout
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;