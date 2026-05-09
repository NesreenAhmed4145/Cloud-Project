const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// الربط مع الراوتس
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
// الاتصال بالمونجو
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🚀 Connected to MongoDB Atlas Successfully!'))
    .catch(err => console.error('❌ Connection Error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`📡 Server is running on port ${PORT}`);
});