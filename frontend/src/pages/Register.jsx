import React from 'react';
import { useState } from 'react';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'customer' // القيمة الافتراضية
  });

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        address: ["Cairo, Egypt"], // رجعناها Array عشان الـ Schema طالباها كده
        type: formData.role // السر هنا! بناخد القيمة ونبعتها للباك إند تحت اسم "type"
      };

      const response = await axios.post('http://localhost:8000/api/users/register', payload);
      
      alert('Account created successfully!');
      navigate('/login'); 
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error';
      alert(errorMessage); 
    }
  }; 
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Create New Account</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Your Name" 
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="name@example.com" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Enter Password"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Account Type</Form.Label>
                  <Form.Select 
                    value={formData.role} /* التعديل التاني: ربط القيمة بالـ State */
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="customer">Client</option>
                    <option value="restaurant_owner">Restaurant Owner</option>
                    <option value="delivery">Delivery</option>

                  </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Register
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;