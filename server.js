const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');
// Connect to database
connectDB();

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
});
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
