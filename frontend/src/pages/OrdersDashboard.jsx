import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]); // مكان حفظ الطلبات
  const [loading, setLoading] = useState(true); // حالة التحميل

  // --- start menna: تعديل الـ fetch والـ update ---
  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); 
      const restaurantId = user?._id || user?.id; // هنا الـ ID بتاع صاحب المطعم هو الـ Restaurant ID

      if (restaurantId) {
        // بنادي على المسار المخصص للمطاعم اللي عملناه في الـ Controller
        const response = await axios.get(`http://localhost:8000/api/orders/restaurant/${restaurantId}`);
        setOrders(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // بننادي على الـ Patch Route اللي عملناه في الـ Gateway
      await axios.patch(`http://localhost:8000/api/orders/${orderId}/status`, {
        status: newStatus
      });
      // بعد ما نحدث، بنجيب البيانات تاني عشان الجدول يتحدث
      fetchOrders(); 
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  // --- end menna ---

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading Orders...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Restaurant Orders Dashboard</h2>
        <Button variant="outline-primary" onClick={fetchOrders}>Refresh Data</Button>
      </div>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? orders.map((order) => (
            <tr key={order._id}>
              {/* 1. عمود الـ ID */}
              <td>{order._id ? order._id.substring(0, 8) : 'N/A'}...</td>
              
              {/* 2. عمود الزبون */}
              <td>{order.userId || 'Guest User'}</td>
              
              {/* 3. عمود السعر */}
              <td>{order.totalPrice || 0} EGP</td>
              
              {/* 4. عمود الحالة مع Badge ملون */}
              <td>
                <Badge bg={
                  order.status === 'Pending' ? 'warning' : 
                  order.status === 'Ready for Pickup' ? 'info' : 'success'
                }>
                  {order.status || 'unknown'}
                </Badge>
              </td>
              
              {/* 5. عمود الـ Actions (الزراير اللي بتغير الحالة) */}
              <td>
                <div className="d-flex gap-2">
                  {order.status === 'Pending' && (
                    <Button 
                      variant="success" 
                      size="sm" 
                      onClick={() => handleUpdateStatus(order._id, 'Confirmed')}
                    >
                      Confirm ✅
                    </Button>
                  )}
                  
                  {order.status === 'Confirmed' && (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleUpdateStatus(order._id, 'Preparing')}
                    >
                      Start Cooking 👨‍🍳
                    </Button>
                  )}

                  {order.status === 'Preparing' && (
                    <Button 
                      variant="warning" 
                      size="sm" 
                      onClick={() => handleUpdateStatus(order._id, 'Ready for Pickup')}
                    >
                      Ready for Pickup 📦
                    </Button>
                  )}
                  
                  {/* زرار عرض التفاصيل دايماً موجود */}
                  <Button variant="outline-info" size="sm">View</Button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No orders found for your restaurant.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default OrdersDashboard;