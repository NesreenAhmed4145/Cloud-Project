import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Card, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios'; // ضفنا مكتبة axios

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]); // شلنا الداتا الوهمية
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [loading, setLoading] = useState(true); // عشان الـ Spinner

  // 1. دالة لجلب المنيو من الباك إند
  const fetchMenu = async () => {
    try {
      // ملحوظة: اتأكدي من اللينك ده من زمايلك (هل هو /api/menu ولا حاجة تانية؟)
      const response = await axios.get('http://localhost:8000/api/menu');
      setMenuItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu:', error);
      setLoading(false);
    }
  };

  // تنفيذ جلب الداتا أول ما الصفحة تفتح
  useEffect(() => {
    fetchMenu();
  }, []);

  // 2. دالة إضافة وجبة جديدة للباك إند
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (newItem.name && newItem.price) {
      try {
        // نبعت الداتا للسيرفر
        const response = await axios.post('http://localhost:8000/api/menu', newItem);
        
        // نضيف الوجبة اللي رجعت من السيرفر (عشان يكون فيها _id بتاع الداتا بيز) للجدول
        setMenuItems([...menuItems, response.data]); 
        setNewItem({ name: '', price: '' }); // تصفير الفورم
        alert('Dish added successfully!');
      } catch (error) {
        console.error('Error adding dish:', error);
        alert('Failed to add dish. Please try again.');
      }
    }
  };

  // 3. دالة حذف وجبة
  const handleDeleteItem = async (id) => {
    // رسالة تأكيد قبل الحذف
    if (window.confirm('Are you sure you want to delete this dish?')) {
      try {
        await axios.delete(`http://localhost:8000/api/menu/${id}`);
        // تحديث الجدول بعد الحذف (نشيل الوجبة من الـ state)
        setMenuItems(menuItems.filter(item => item._id !== id));
      } catch (error) {
        console.error('Error deleting dish:', error);
        alert('Failed to delete dish.');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading Menu...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Manage Your Menu</h2>
      <Row className="mt-4">
        {/* فورم إضافة وجبة جديدة */}
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h4>Add New Dish</h4>
            <Form onSubmit={handleAddItem}>
              <Form.Group className="mb-3">
                <Form.Label>Dish Name</Form.Label>
                <Form.Control 
                  type="text" 
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="e.g. Pasta" 
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price (EGP)</Form.Label>
                <Form.Control 
                  type="text" 
                  inputMode="numeric" 
                  value={newItem.price}
                  placeholder="0.00" 
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                      setNewItem({...newItem, price: value})
                    }
                  }}
                  required
                />
              </Form.Group>
              <Button variant="success" type="submit" className="w-100">Add to Menu</Button>
            </Form>
          </Card>
        </Col>

        {/* جدول عرض المنيو */}
        <Col md={8}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Dish Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.length > 0 ? menuItems.map(item => (
                // غيرنا الـ key لـ _id عشان ده الديفولت في MongoDB
                <tr key={item._id}> 
                  <td>{item.name}</td>
                  <td>{item.price} EGP</td>
                  <td>
                    {/* شغلنا زرار الحذف وربطناه بالـ _id */}
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="text-center">No dishes found in your menu.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default MenuManagement;