import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. هنجيب بيانات اليوزر من الـ Local Storage عشان نعرف مين الـ Owner
      const user = JSON.parse(localStorage.getItem('user')); 
      const ownerId = user?._id || user?.id;

      if (!ownerId) {
        setError("User session not found. Please log in again.");
        setLoading(false);
        return;
      }

      // 2. الخطوة الأولى: نجيب بيانات المطعم بناءً على صاحب الحساب
      // ⚠️ ملاحظة مهمة: اتأكدي إن الـ Route في الباك إند اسمه /owner/:ownerId
      const resResponse = await axios.get(`http://localhost:8000/api/restaurants/owner/${ownerId}`);
      
      const restaurantId = resResponse.data._id;

      if (restaurantId) {
        // 3. الخطوة التانية: نجيب الطلبات بالـ ID بتاع المطعم اللي لسه جاي
        const response = await axios.get(`http://localhost:8000/api/orders/restaurant/${restaurantId}`);
        setOrders(response.data);
      } else {
        setError("Could not link this user to a restaurant.");
      }

      setLoading(false);
    } catch (err) {
      console.error("❌ Dashboard Error:", err);
      // لو السيرفر رد بـ 404 معناها إن اليوزر ملوش مطعم متسجل لسه
      const errorMessage = err.response?.status === 404 
        ? "No restaurant found for this owner. Go create one first!" 
        : "Something went wrong while fetching orders.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // تحديث حالة الطلب عن طريق الـ Gateway
      await axios.patch(`http://localhost:8000/api/orders/${orderId}/status`, {
        status: newStatus
      });
      // بعد ما نحدث، بنعمل Refresh للداتا عشان الجدول يبان فيه التغيير
      fetchOrders(); 
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 font-monospace">Syncing with Microservices...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Owner Dashboard: Orders</h2>
        <Button variant="outline-primary" onClick={fetchOrders} className="shadow-sm">
          🔄 Refresh Data
        </Button>
      </div>

      {error && (
        <Alert variant="info" className="text-center shadow-sm">
          {error}
        </Alert>
      )}

      <div className="table-responsive shadow rounded">
        <Table striped bordered hover className="mb-0">
          <thead className="table-dark">
            <tr>
              <th># Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="align-middle">
                  <td className="font-monospace text-primary">{order._id.substring(0, 8)}...</td>
                  <td>{order.userId || 'Guest User'}</td>
                  <td className="fw-bold">{order.totalPrice || 0} EGP</td>
                  <td>
                    <Badge bg={
                      order.status === 'Pending' ? 'warning' : 
                      order.status === 'Ready for Pickup' ? 'info' : 'success'
                    }>
                      {order.status || 'Processing'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      {order.status === 'Pending' && (
                        <Button variant="success" size="sm" onClick={() => handleUpdateStatus(order._id, 'Confirmed')}>
                          Accept Order
                        </Button>
                      )}
                      {order.status === 'Confirmed' && (
                        <Button variant="primary" size="sm" onClick={() => handleUpdateStatus(order._id, 'Preparing')}>
                          Cook Now
                        </Button>
                      )}
                      {order.status === 'Preparing' && (
                        <Button variant="warning" size="sm" onClick={() => handleUpdateStatus(order._id, 'Ready for Pickup')}>
                          Ready 📦
                        </Button>
                      )}
                      <Button variant="link" size="sm" className="text-decoration-none">Details</Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">
                  No orders found. Once customers start buying, you'll see them here!
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default OrdersDashboard;