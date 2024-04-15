const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

// custom files
const AppError = require('./utils/appError');
const nameYourRouter = require('./routes/nameYourRouter.js');
const globalErrorHandler = require('./controller/errorController.js');

// this express.static is used to open files that are supported by browsers.
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));


// 1) Add Global middlewares
// Set secuitry http header
app.use(helmet());

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Api rate limiting
const limiter = rateLimit({
    max: 100,
    windowMS: 60 * 60 * 1000,
    message: 'Too many request from this ip, Please try again in an hour'
});

app.use('/api', limiter);

// Body parser, reading data from the body into req body
app.use(express.json({
    limit: '10kb'
}));

app.use(cookieParser());

app.use(express.urlencoded({
    extended: true,
    limit: '10kb'
}));

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution (hpp: http parament pollution)
app.use(hpp({
    whitelist: [
    ]
}));


app.use((req, res, next) => {
    console.log(req.cookies);
    next();
});

//  2) Routes
// added for testing supertesting
app.get('/', (req, res) => {
    res.send('Hello World');
  });
  
app.use('/api', nameYourRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));  // anything passed to next is understandable that it is an error and it will send the error to the global error handling middleware
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;