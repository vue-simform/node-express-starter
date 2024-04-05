const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

const defineYourMethod = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: 'get your data from model and do the necessary'
    })
    next();
};

const anotherMethod = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: 'Nice job'
    })
    next();
});


// Verify the error handler utility
const throwError = catchAsync(async (req, res, next) => {
    return next(new AppError('throwing error', 400));
})

module.exports = { defineYourMethod, anotherMethod, throwError }