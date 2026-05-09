import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeliveryDashboard = () => {
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders'); 
        
        const activeOrders = response.data.filter(order => 
          order.status === 'Out for Delivery' || order.status === 'Preparing'
        );
        
        setDeliveries(activeOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDeliver = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, { 
        status: 'Delivered' 
      });

      setDeliveries(deliveries.filter(order => order._id !== orderId));
      alert(`Order has been marked as Delivered! 🎉`);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', direction: 'ltr', paddingBottom: '50px' }}>
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)', padding: '60px 20px', color: 'white', textAlign: 'center', marginBottom: '50px', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900' }}>
          <i className="fa-solid fa-motorcycle me-3"></i> 
          Delivery Portal
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: '0.9' }}>Your active deliveries for today</p>
      </div>

      <div>
        {loading ? (
          /* شاشة التحميل مسنترة بالـ Flexbox */
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <h3 className="text-muted fw-bold">
              <i className="fa-solid fa-spinner fa-spin me-2" style={{ color: '#ff4757' }}></i> 
              Loading deliveries...
            </h3>
          </div>
        ) : deliveries.length === 0 ? (
          /* رسالة عدم وجود طلبات مسنترة بالمسطرة */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', textAlign: 'center' }}>
            <h2 className="text-muted fw-bold">No active deliveries right now! 🚀</h2>
            <p className="text-muted">Take a break, you're all caught up.</p>
          </div>
        ) : (
          
          /* الكروت مسنترة */
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px', textAlign: 'left' }}>
            
            {deliveries.map((order) => (
              <div key={order._id} className="card border-0 shadow-lg mb-5" style={{ borderRadius: '25px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                
                <div className="bg-dark text-white p-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 className="m-0 fw-bold">
                    Order #{order._id ? order._id.substring(order._id.length - 6) : 'N/A'} 
                  </h4>
                  <span className="badge bg-danger fs-6 rounded-pill">{order.status}</span>
                </div>

                <div className="card-body p-4 p-md-5">
                  
                  <div style={{ marginBottom: '40px' }}>
                    <h5 className="fw-bold" style={{ color: '#ff4757', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                      <i className="fa-solid fa-user me-2"></i> Customer Details
                    </h5>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <p className="text-muted mb-1 fs-6">Name</p>
                      <h5 className="fw-bold m-0 text-dark">{order.customerName || 'Customer'}</h5>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <p className="text-muted mb-1 fs-6">Phone</p>
                      <h5 className="fw-bold m-0 text-dark">{order.phone || 'N/A'}</h5>
                    </div>

                    <div>
                      <p className="text-muted mb-1 fs-6">Address</p>
                      <h5 className="fw-bold m-0 text-dark">{order.address || 'Location provided in app'}</h5>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fdfbfb', border: '1px dashed #ccc', borderRadius: '15px', padding: '20px', marginBottom: '30px' }}>
                    
                    <h5 className="fw-bold text-dark text-center" style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                      <i className="fa-solid fa-receipt me-2"></i> Order Receipt
                    </h5>
                    
                    {order.items && order.items.map((item, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                        <span className="fw-bold text-secondary">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="fw-bold text-dark">{item.price * item.quantity} EGP</span>
                      </div>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                      <h4 className="fw-bold m-0 text-dark">Total:</h4>
                      <h4 className="fw-bold m-0" style={{ color: '#ff4757' }}>{order.totalPrice} EGP</h4>
                    </div>

                    <div className="text-center" style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px dotted #ddd' }}>
                      <span className={`badge ${order.paymentMethod ? (order.paymentMethod.includes('Paid') ? 'bg-success' : 'bg-warning text-dark') : 'bg-secondary'} p-2 fs-6`}>
                        {order.paymentMethod || 'Cash on Delivery'}
                      </span>
                    </div>

                  </div>

                  <div>
                    <button 
                      onClick={() => handleDeliver(order._id)}
                      className="btn btn-danger btn-lg w-100 fw-bold shadow-sm" 
                      style={{ borderRadius: '15px', padding: '15px', backgroundColor: '#ff4757', border: 'none', transition: '0.3s' }}
                    >
                      <i className="fa-solid fa-check-circle me-2"></i> Mark as Delivered
                    </button>
                  </div>

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