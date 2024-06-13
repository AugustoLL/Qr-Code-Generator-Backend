const logger = require('../logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Something went wrong!';
    res.status(status).json({ error: message });
};

module.exports = errorHandler;