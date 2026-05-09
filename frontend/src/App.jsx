import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// Import All Pages
import Restaurants from './pages/Restaurants';
import Menu from './pages/Menu';
import MyCart from './pages/MyCart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuManagement from './pages/MenuManagement';
import OrdersDashboard from './pages/OrdersDashboard';
import Home from './pages/Home';
import Profile from './pages/Profile';
import RestaurantSettings from './pages/RestaurantSettings';
// استدعاء الـ AuthContext
import { useAuth } from './context/AuthContext'; 

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth(); 

  const hideSidebar = ['/login', '/register'].includes(location.pathname);

  if (hideSidebar) return null;

  const allMenuItems = [
    { name: 'Home', path: '/', icon: 'fa-house' },
    { name: 'Profile', path: '/profile', icon: 'fa-user' },
    { name: 'Restaurants', path: '/restaurants', icon: 'fa-utensils' },
    { name: 'My Cart', path: '/cart', icon: 'fa-cart-shopping' },
    { name: 'Order Tracking', path: '/order-history', icon: 'fa-clock-rotate-left' },
    // دول بتوع المطعم ومميزين بـ type
    { name: 'Admin Orders', path: '/admin/orders', icon: 'fa-gauge-high', type: 'restaurant_owner' },
    { name: 'Menu Editor', path: '/admin/menu', icon: 'fa-pen-to-square', type: 'restaurant_owner' },
    { name: 'Restaurant Info', path: '/admin/restaurant-settings', icon: 'fa-store', type: 'restaurant_owner' },
  ];

  // التعديل هنا 👇: بنسأل على item.type و user.type
  const visibleMenuItems = allMenuItems.filter(
    (item) => !item.type || (user && user.type === item.type)
  );

  return (
    <div style={{
      width: '280px', height: '100vh', backgroundColor: '#ffffff',
      borderRight: '1px solid #eee', position: 'fixed', left: 0, top: 0,
      display: 'flex', flexDirection: 'column', padding: '40px 20px', zIndex: 1000
    }}>
      <h2 style={{ color: '#ff4757', fontWeight: '900', marginBottom: '50px', textAlign: 'center' }}>
        <i className="fa-solid fa-utensils me-2"></i> Foodie
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {visibleMenuItems.map((item) => (
          <Link 
            key={item.path} to={item.path} 
            style={{
              textDecoration: 'none', padding: '12px 20px', borderRadius: '12px',
              fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center',
              transition: '0.3s',
              backgroundColor: location.pathname === item.path ? '#ff4757' : 'transparent',
              color: location.pathname === item.path ? '#ffffff' : '#555',
            }}
          >
            <i className={`fa-solid ${item.icon} me-3`} style={{ width: '20px' }}></i>
            {item.name}
          </Link>
        ))}
        
        <hr />
        
        <Link to="/login" onClick={logout} style={{ textDecoration: 'none', color: '#888', padding: '10px 20px' }}>
          <i className="fa-solid fa-right-from-bracket me-3"></i> Logout
        </Link>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const location = useLocation();
  const noSidebar = ['/login', '/register'].includes(location.pathname);
  
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ 
        flex: 1, 
        marginLeft: noSidebar ? '0' : '280px', 
        minHeight: '100vh',
        transition: '0.3s'
      }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* User Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<Menu />} />
          <Route path="/cart" element={<MyCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-history" element={<OrderHistory />} />

          {/* Admin Pages */}
          <Route path="/admin/menu" element={<MenuManagement />} />
          <Route path="/admin/orders" element={<OrdersDashboard />} />
          <Route path="/admin/restaurant-settings" element={<RestaurantSettings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;