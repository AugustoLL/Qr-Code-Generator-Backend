const logger = require('../logger');
const AppError = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    logger.error(err.stack);

    const statusCode = err.status || 500;
    const message = err.message || 'Internal server error!';
    const status = err.status || 'error';

    res.status(statusCode). json({
        statusCode: statusCode,
        status: status,
        error: message || 'Internal server error!'
    });
};

module.exports = errorHandler;