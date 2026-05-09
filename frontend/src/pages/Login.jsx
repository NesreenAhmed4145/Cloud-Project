import React from 'react';
import { useState } from 'react';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; // 1. استدعاء مكتبة axios مهم جداً

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // استدعاء دالة الدخول من الـ Context
  const navigate = useNavigate();

  // 2. تحويل الدالة لـ async عشان نكلم السيرفر
  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/users/login', {
        email,
        password
      });

      // الداتا كلها متخزنة هنا
    const responseData = response.data; 

// ✅ بننادي دالة الـ login وبنبعت اليوزر والتوكن مع بعض
login(responseData.user, responseData.token); 

alert('Logged in successfully!');

// التوجيه بناءً على النوع
if (responseData.user.type === 'restaurant_owner') {
  navigate('/admin/orders'); 
} else {
  navigate('/'); 
}

    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={5}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4">Login</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-2">
                  Sign In
                </Button>
              </Form>
              <div className="text-center mt-3">
                <small>Don't have an account? <a href="/register">Register here</a></small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;