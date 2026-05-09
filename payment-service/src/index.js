const express = require('express');
const app = express();

const PORT = process.env.PORT || 5003; 
app.get('/', (req, res) => {
    res.send('Service is running!');
});

app.listen(PORT, () => {
    console.log(`🚀 Service is running on port ${PORT}`);
});