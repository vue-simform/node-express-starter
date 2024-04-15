const AppError = require('./../utils/appError');

// eslint-disable-next-line no-unused-vars
const yourErrorMethod = (_err) => {
    // add your logics if you want
    const message = 'Show your message';
    return new AppError(message, 400);
};
const sendErrorDev = (err, req, res) => {

    // error for api's
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
};

const sendErrorProd = (err, req, res) => {
    // error for api's
    if (req.originalUrl.startsWith('/api')) {
        // Operational, trusted error: send message to the client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        // Programming or other unknown Error: don't want to leak error details
        }
        // 1) Log error
        console.error('Error', err);
        // 2) Send Generic message
        return res.status(500).json({
            status: "error",
            message: "Something went very wrong"
        });
    }
};

// Error handling middleware
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // eslint-disable-next-line no-undef
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    // eslint-disable-next-line no-undef
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err};
        error.message = err.message;
        // based on error name you can define the error message.
        if (error.name === 'error_name_from_other_source') error = yourErrorMethod(error);

        sendErrorProd(error, req, res);
    }
};