const express = require('express');
const morgan = require('morgan');
const qrCodeRoutes = require('./routes/qrCodeRoutes');
const limiter = require('./middlewares/rateLimiter');
const { PORT } = require('./config');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');

const app = express();

// Middleware
// Request logging middleware
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
})
// JSON middleware
app.use(express.json());
// URL encoded middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
// Rate limiter
app.use(limiter);
// Setup CORS
// const corsOptions = {
//     // origin: 'http://qr-code-generator-frontend:3000',
//     // methods: ['GET', 'POST', 'OPTIONS'],
//     origin: ['http://localhost:3000', 'http://192.168.*.*:3000'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
// }
const corsOptions = {
    origin: ['https://localhost:3000', 'http://frontend:3000', 'https://qr-code-generator-frontend:3000'], // Adjust as needed
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['DNT', 'User-Agent', 'X-Requested-With', 'If-Modified-Since', 'Cache-Control', 'Content-Type', 'Range'],
    credentials: true,  // Enable CORS credentials  
    maxAge: 1728000  // 20 days in seconds
  };
app.use(cors());

// Routes
app.use('/api', qrCodeRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`Server is running on port: ${PORT}`);
    logger.info(`CORS options: ${JSON.stringify(corsOptions)}`);
});