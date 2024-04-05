import { Request, Response, NextFunction } from 'express';
import { AppError } from './../utils/appError';

const yourErrorMethod = (err: Error): AppError => {
    // Add your logic here if needed
    const message: string = 'Show your message';
    return new AppError(message, 400);
};

const sendErrorDev = (err: AppError, req: Request, res: Response): void => {
    // Error for APIs
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
};

const sendErrorProd = (err: AppError, req: Request, res: Response): void => {
    // Error for APIs
    if (req.originalUrl.startsWith('/api')) {
        // Operational, trusted error: send message to the client
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        } else {
            // Programming or other unknown Error: don't want to leak error details
            // 1) Log error
            console.error('Error', err);
            // 2) Send Generic message
            res.status(500).json({
                status: "error",
                message: "Something went very wrong"
            });
        }
    }
};

// Error handling middleware
export default (err: Error, req: Request, res: Response, next: NextFunction): void => {
    let error: AppError = new AppError(err.message, err instanceof AppError ? err.statusCode : 500);
    error.status = err instanceof AppError ? err.status : 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        // Clone the error object to avoid mutating the original error
        error = { ...error };
        // Based on error name you can define the error message
        if (error.name === 'error_name_from_other_source') {
            error = yourErrorMethod(error);
        }

        sendErrorProd(error, req, res);
    }
};
