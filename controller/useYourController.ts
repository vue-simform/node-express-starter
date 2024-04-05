import { Request, Response, NextFunction } from 'express';
import catchAsync from './../utils/catchAsync';
import { AppError } from '../utils/appError';

const defineYourMethod = (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
        status: 'success',
        data: 'get your data from model and do the necessary'
    });
    next();
};

const anotherMethod = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.status(200).json({
        status: 'success',
        data: 'Nice job'
    });
    next();
});

// Verify the error handler utility
const throwError = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return next(new AppError('throwing error', 400));
});

export { defineYourMethod, anotherMethod, throwError };
