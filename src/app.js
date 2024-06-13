const express = require('express');
const morgan = require('morgan');
const qrCodeRoutes = require('./routes/qrCodeRoutes');
const limiter = require('./middlewares/rateLimiter');
const { PORT } = require('./config');
const logger = require('./logger');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(limiter);

// Routes
app.use('/api', qrCodeRoutes);

// Error handler
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    logger.info(`Server is running on port: ${PORT}`);
});