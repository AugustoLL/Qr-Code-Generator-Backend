const express = require('express');
const morgan = require('morgan');
const qrCodeRoutes = require('./routes/qrCodeRoutes');
const limiter = require('./middlewares/rateLimiter');
const { PORT } = require('./config');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(limiter);

// Routes
app.use('/api', qrCodeRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});