// Cloud-Project\payment-service\src\app.js
const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payment.routes');

const app = express();
// Cloud-Project\payment-service\src\app.js
const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payment.routes');

const app = express();
app.use(cors()); 
app.use(express.json());

// التعديل الجوهري: هنخليها تبدأ بـ /api عشان تطابق الـ Gateway
app.use('/api', paymentRoutes); 

app.get('/health', (req, res) => {
  res.send('Payment Service is Running...');
});

module.exports = app;