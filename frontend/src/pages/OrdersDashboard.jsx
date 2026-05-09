import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]); // مكان حفظ الطلبات
  const [loading, setLoading] = useState(true); // حالة التحميل

  // دالة لجلب البيانات من موظف الاستقبال (API Gateway اللي شغال على 8000)
  // const fetchOrders = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8000/api/orders');
      
  //     // السطر ده هيطبعلك الداتا في الـ Console عشان تتأكدي من أسماء الحقول اللي جاية من الباك إند
  //     console.log("Orders Data from Backend:", response.data); 
      
  //     setOrders(response.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching orders:", error);
  //     setLoading(false);
  //   }
  // };
  
  //اللى كانت شغلة معايا وانا بعمل تيست
//   const fetchOrders = async () => {
//   try {
//     const response = await axios.get('http://localhost:8000/api/orders');
//     console.log("Data from API:", response.data); // السطر ده مهم جداً
//     setOrders(Array.isArray(response.data) ? response.data : []); // تأكدي إنها Array
//     setLoading(false);
//   } catch (error) {
//     console.error("Fetch error:", error);
//     setLoading(false);
//   }
// };

const fetchOrders = async () => {
  try {
    // 1. هاتي بيانات اليوزر من الـ localStorage (اللي اتسيفت وقت الـ Login)
    const user = JSON.parse(localStorage.getItem('user')); 
    const userId = user?._id || user?.id; // اتأكدي السيف باسم id ولا _id

    if (userId) {
      // 2. ابعتي الـ ID في اللينك للبوابة
      const response = await axios.get(`http://localhost:8000/api/orders/${userId}`);
      console.log("Orders for this user:", response.data);
      setOrders(response.data);
    }
    setLoading(false);
  } catch (error) {
    console.error("Fetch error:", error);
    setLoading(false);
  }
};

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
              <td>{order._id ? order._id.substring(0, 8) : 'N/A'}...</td>
              {/* خدي بالك لو الباك إند بيبعت الاسم أو السعر بأسماء تانية، هتحتاجي تعدلي دول */}
              <td>{order.userId || 'Guest User'}</td>
              <td>${order.totalPrice || 0}</td>
              <td>
                <Badge bg={order.status === 'pending' ? 'warning' : 'success'}>
                  {order.status || 'unknown'}
                </Badge>
              </td>
              <td>
                <Button variant="info" size="sm" className="me-2">View</Button>
                <Button variant="success" size="sm">Accept</Button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="text-center">No orders found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default OrdersDashboard;