import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

// const MyCart = () => {
//   const { cartItems, removeFromCart } = useCart();
//   const navigate = useNavigate();

//   // حساب المجموع الكلي
//   const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

//   return (
//     <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', direction: 'ltr', textAlign: 'center', position: 'relative' }}>
      
//       {/* Header الملون */}
//       <div style={{ 
//         background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)', 
//         padding: '80px 20px', color: 'white', marginBottom: '60px'
//       }}>
//         <h1 style={{ fontSize: '4.5rem', fontWeight: '900', marginBottom: '10px' }}>My Cart</h1>
//         <p style={{ fontSize: '1.5rem', opacity: '0.9' }}>Review your delicious picks</p>
//       </div>

//       <div className="container pb-5">
//         <div className="card border-0 shadow-sm p-5" style={{ borderRadius: '40px', backgroundColor: '#f9f9f9' }}>
//           <h2 className="fw-bold mb-5" style={{ fontSize: '2.5rem' }}>Your Selection</h2>
          
//           {/* عرض الأصناف 3 في الصف */}
//           <div className="row g-4 justify-content-center">
//             {cartItems.length === 0 ? (
//               <div className="py-5">
//                 <p className="fs-3 text-muted">Your cart is empty! 🛒</p>
//                 <button className="btn btn-danger mt-3" onClick={() => navigate('/')}>Explore Restaurants</button>
//               </div>
//             ) : (
//               cartItems.map(item => (
//                 <div key={item.id} className="col-12 col-md-6 col-lg-4">
//                   <div className="p-4 bg-white shadow-sm border-0 h-100" style={{ borderRadius: '25px' }}>
//                     <h4 className="fw-bold mb-1">{item.name}</h4>
//                     <p className="text-muted mb-2">{item.price} EGP x {item.quantity}</p>
//                     <h5 className="fw-bold text-danger mb-3">{item.price * item.quantity} EGP</h5>
//                     <button 
//                       className="btn btn-sm btn-outline-danger w-100 py-2" 
//                       style={{ borderRadius: '12px' }} 
//                       onClick={() => removeFromCart(item.id)}
//                     >
//                       Remove 🗑️
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* الجزء الأخير: الـ Total وزرار الطلب */}
//           {cartItems.length > 0 && (
//             <div style={{ 
//               marginTop: '80px', 
//               paddingTop: '40px', 
//               borderTop: '2px solid #eee' 
//             }}>
//               {/* Total في سطر واحد مسنتر */}
//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'baseline', 
//                 gap: '15px',
//                 marginBottom: '40px'
//               }}>
//                 <h2 className="fw-bold m-0" style={{ fontSize: '2.5rem' }}>Total:</h2>
//                 <h2 className="fw-bold m-0" style={{ color: '#ff4757', fontSize: '3.5rem' }}>{total} EGP</h2>
//               </div>

//               {/* زرار Order Now */}
//               <button 
//                 className="btn btn-danger btn-lg fw-bold shadow-lg" 
//                 style={{ 
//                   borderRadius: '20px', 
//                   padding: '20px 80px', 
//                   fontSize: '1.8rem', 
//                   backgroundColor: '#ff4757', 
//                   border: 'none',
//                   transition: '0.3s'
//                 }}
//                 onClick={() => navigate('/checkout')}
//               >
//                 Order Now 🚀
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyCart;

// --- start menna ---
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
// --- end menna ---

const MyCart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart(); // زودنا clearCart لو موجودة عندك
  const { user } = useAuth(); // سحبنا بيانات اليوزر
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // --- start menna ---
  const handleOrderNow = async () => {
    if (!user) {
      alert("Please login first!");
      return navigate('/login');
    }

    const orderData = {
      userId: user.id, // ID اليوزر من التوكن/الكونتيكست
      restaurantId: cartItems[0]?.restaurantId || "default_id", // اتأكدي إن الـ item فيه ريستورانت id
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: total,
      deliveryAddress: user.address[0] || "No Address Provided", // بناخد أول عنوان مسجله
    };

    try {
      const response = await axios.post('http://localhost:8000/api/orders', orderData);
      
      if (response.status === 201) {
        alert("Order Placed Successfully! 🚀");
        // clearCart(); // امسحي الكاريت بعد نجاح الطلب لو الدالة موجودة
        navigate('/order-history'); // وديه لصفحة التتبع فوراً
      }
    } catch (err) {
      console.error("Order Error:", err);
      alert("Failed to place order. Try again!");
    }
  };
  // --- end menna ---

  return (
    
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', direction: 'ltr', textAlign: 'center', position: 'relative' }}>
      
      {/* Header الملون */}
      <div style={{ 
        background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)', 
        padding: '80px 20px', color: 'white', marginBottom: '60px'
      }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '900', marginBottom: '10px' }}>My Cart</h1>
        <p style={{ fontSize: '1.5rem', opacity: '0.9' }}>Review your delicious picks</p>
      </div>

      <div className="container pb-5">
        <div className="card border-0 shadow-sm p-5" style={{ borderRadius: '40px', backgroundColor: '#f9f9f9' }}>
          <h2 className="fw-bold mb-5" style={{ fontSize: '2.5rem' }}>Your Selection</h2>
          
          {/* عرض الأصناف 3 في الصف */}
          <div className="row g-4 justify-content-center">
            {cartItems.length === 0 ? (
              <div className="py-5">
                <p className="fs-3 text-muted">Your cart is empty! 🛒</p>
                <button className="btn btn-danger mt-3" onClick={() => navigate('/')}>Explore Restaurants</button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="col-12 col-md-6 col-lg-4">
                  <div className="p-4 bg-white shadow-sm border-0 h-100" style={{ borderRadius: '25px' }}>
                    <h4 className="fw-bold mb-1">{item.name}</h4>
                    <p className="text-muted mb-2">{item.price} EGP x {item.quantity}</p>
                    <h5 className="fw-bold text-danger mb-3">{item.price * item.quantity} EGP</h5>
                    <button 
                      className="btn btn-sm btn-outline-danger w-100 py-2" 
                      style={{ borderRadius: '12px' }} 
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove 🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* الجزء الأخير: الـ Total وزرار الطلب */}
          {cartItems.length > 0 && (
            <div style={{ 
              marginTop: '80px', 
              paddingTop: '40px', 
              borderTop: '2px solid #eee' 
            }}>
              {/* Total في سطر واحد مسنتر */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'baseline', 
                gap: '15px',
                marginBottom: '40px'
              }}>
                <h2 className="fw-bold m-0" style={{ fontSize: '2.5rem' }}>Total:</h2>
                <h2 className="fw-bold m-0" style={{ color: '#ff4757', fontSize: '3.5rem' }}>{total} EGP</h2>
              </div>
    
                <button 
                  className="btn btn-danger btn-lg fw-bold shadow-lg" 
                  style={{ /* ستايلك الجميل */ }}
                  onClick={handleOrderNow} // ندهنا الدالة الجديدة
                >
                  Order Now 🚀
                </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default MyCart;