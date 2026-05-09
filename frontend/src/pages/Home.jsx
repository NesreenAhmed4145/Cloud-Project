import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  // بنسحب بيانات اليوزر عشان نعرف هو عامل لوجين ولا لأ
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Container fluid className="py-4 px-md-5">
      
      {/* 1. الـ Hero Section (الجزء العلوي الملون) */}
      <div
        className="shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)',
          borderRadius: '30px',
          padding: '80px 40px',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <h1 className="display-4 fw-bold mb-4" style={{ letterSpacing: '1px' }}>
          {/* لو اليوزر موجود بنرحب بيه باسمه، لو لأ بنعرض ترحيب عام */}
          {user ? `Welcome Back, ${user.name}! 🍔` : 'Welcome to Foodie 🍕'}
        </h1>
        
        <p className="lead mb-5 fs-4 fw-light" style={{ opacity: '0.9' }}>
          Delicious food, fastest delivery, and easy restaurant management all in one place!
        </p>

        {/* 2. الزراير المشروطة (Conditional Buttons) */}
        {!user ? (
          // لو مش عامل لوجين: اظهر زراير الدخول
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button as={Link} to="/login" variant="light" size="lg" className="px-5 fw-bold text-danger shadow-sm" style={{ borderRadius: '15px' }}>
              Login
            </Button>
            <Button as={Link} to="/register" variant="outline-light" size="lg" className="px-5 fw-bold" style={{ borderWidth: '2px', borderRadius: '15px' }}>
              Create Account
            </Button>
          </div>
        ) : (
          // لو عامل لوجين: اظهر زراير تصفح الأكل
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button onClick={() => navigate('/restaurants')} variant="light" size="lg" className="px-5 fw-bold text-danger shadow" style={{ borderRadius: '15px' }}>
              Browse Restaurants 🛵
            </Button>
            <Button onClick={() => navigate('/cart')} variant="dark" size="lg" className="px-5 fw-bold shadow" style={{ borderRadius: '15px' }}>
              View My Cart 🛒
            </Button>
          </div>
        )}
      </div>

      {/* 3. جزء المميزات (Features) */}
      <Row className="mt-5 pt-3 g-4 text-center">
        <Col md={4}>
          <Card className="border-0 h-100 bg-transparent">
            <Card.Body>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚀</div>
              <h4 className="fw-bold" style={{ color: '#2d3436' }}>Fast Delivery</h4>
              <p className="text-muted">Hot food delivered to your doorstep in less than 30 minutes.</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="border-0 h-100 bg-transparent">
            <Card.Body>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👨‍🍳</div>
              <h4 className="fw-bold" style={{ color: '#2d3436' }}>Top Restaurants</h4>
              <p className="text-muted">Choose from a wide variety of the best rated local restaurants.</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 h-100 bg-transparent">
            <Card.Body>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💳</div>
              <h4 className="fw-bold" style={{ color: '#2d3436' }}>Secure Payment</h4>
              <p className="text-muted">Pay online securely or choose cash on delivery. It's up to you!</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
};

export default Home;