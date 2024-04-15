import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import path from 'path';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
// import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { AppError } from './utils/appError'; // Assuming you have an AppError class defined in a separate file
import nameYourRouter from './routes/nameYourRouter';

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Global Middlewares
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// app.use(xss());

app.use(hpp());

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies);
    next();
});

// Routes
// added for testing supertesting
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
  });
  
app.use('/api', nameYourRouter);

// 404 route
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

export default app;
