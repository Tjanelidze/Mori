const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.error('ERROR 💥', err);

        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }


};

const errorHandler = async (err, req, res, next) => {
    console.error("Global error handler caught: ", err); // For immediate server visibility

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (res.headersSent) {
        next(err);
    }

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign(err);
        error.message = err.message;

        if (err.name === 'CastError') error = handleCastErrorDB(err);

        sendErrorProd(error, res);
    } else {
        sendErrorDev(err, res); // fallback: treat unknown env as development
    }
};

module.exports = errorHandler;