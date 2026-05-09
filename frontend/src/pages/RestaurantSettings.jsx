import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RestaurantSettings = () => {
  const { user } = useAuth();
  
  // الـ State اللي شايل بيانات المطعم
  const [formData, setFormData] = useState({
    name: '',
    cuisine: 'Fast Food',
    address: '',
    deliveryTime: '',
    imageUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // هنا المفروض نجيب بيانات المطعم لو هو مسجلها قبل كده
  /* useEffect(() => {
    // تقدري تفعلي الكود ده لما تظبطي الـ GET endpoint في الباك إند
    const fetchMyRestaurant = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/restaurants/my-restaurant', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if(res.data) setFormData(res.data);
      } catch (err) {
        console.log("No restaurant found for this owner yet.");
      }
    };
    fetchMyRestaurant();
  }, []);
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      // بنبعت الداتا للباك إند مع التوكن
      await axios.post('http://localhost:8000/api/restaurants', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Restaurant details saved successfully! 🎉' });
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Failed to save details.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4 px-md-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col lg={8} xl={7}>
          
          <div className="d-flex align-items-center mb-4">
            <div style={{ backgroundColor: '#ff4757', padding: '15px', borderRadius: '15px', color: 'white', marginRight: '15px' }}>
              <i className="fa-solid fa-store fs-3"></i>
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: '#2d3436' }}>Restaurant Settings</h2>
              <p className="text-muted mb-0">Manage your restaurant profile and details</p>
            </div>
          </div>

          <Card className="shadow-sm border-0" style={{ borderRadius: '20px' }}>
            <Card.Body className="p-5">
              
              {message.text && (
                <Alert variant={message.type} style={{ borderRadius: '10px' }}>
                  {message.text}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* اسم المطعم */}
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-secondary">Restaurant Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="e.g. Pizza Palace" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        style={{ padding: '12px', borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>

                  {/* نوع الأكل */}
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-secondary">Cuisine Type</Form.Label>
                      <Form.Select 
                        value={formData.cuisine}
                        onChange={(e) => setFormData({...formData, cuisine: e.target.value})}
                        style={{ padding: '12px', borderRadius: '10px' }}
                      >
                        <option value="Fast Food">Fast Food 🍔</option>
                        <option value="Pizza">Pizza 🍕</option>
                        <option value="Oriental">Oriental Grill 🍢</option>
                        <option value="Healthy">Healthy Food 🥗</option>
                        <option value="Desserts">Desserts 🍰</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* العنوان */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary">Full Address</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="e.g. 123 Main St, Nasr City, Cairo" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                    style={{ padding: '12px', borderRadius: '10px' }}
                  />
                </Form.Group>

                <Row>
                  {/* وقت التوصيل المتوقع */}
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-secondary">Avg. Delivery Time (Mins)</Form.Label>
                      <Form.Control 
                        type="number" 
                        placeholder="e.g. 30" 
                        value={formData.deliveryTime}
                        onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
                        style={{ padding: '12px', borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>

                  {/* رابط لوجو المطعم */}
                  <Col md={6}>
                    <Form.Group className="mb-5">
                      <Form.Label className="fw-semibold text-secondary">Logo Image URL</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="https://example.com/logo.jpg" 
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        style={{ padding: '12px', borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* زرار الحفظ */}
                <div className="d-grid">
                  <Button 
                    variant="danger" 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '14px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}
                  >
                    {loading ? (
                      <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> Saving...</>
                    ) : (
                      'Save Restaurant Profile'
                    )}
                  </Button>
                </div>

              </Form>
            </Card.Body>
          </Card>

        </Col>
      </Row>
    </Container>
  );
};

export default RestaurantSettings;