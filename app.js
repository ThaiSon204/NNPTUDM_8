const express = require('express');
const mongoose = require('mongoose');

// Nhúng file routes vào
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/inventory_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Báo cho Express biết tất cả các API sẽ bắt đầu bằng /api
app.use('/api', apiRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));