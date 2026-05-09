const express = require('express');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

// Middleware لتحويل البيانات اللي جاية لـ JSON
app.use(express.json());

// ربط المسارات (Routes)
app.use('/api', paymentRoutes);

// رابط بسيط للتأكد إن السيرفر شغال (Health Check)
app.get('/', (req, res) => {
  res.send('Payment Service is Running...');
});

module.exports = app;