import * as dotenv from 'dotenv';
import * as http from 'http';
import { AddressInfo } from 'net';
import app from './app';

const envFile: string = process.env.NODE_ENV === 'production'
    ? './.env.prod'
    : process.env.NODE_ENV === 'staging'
    ? './.env.development'
    : './.env.local';

console.log(`${envFile} Loaded!`);


dotenv.config({
    path: envFile
});

const port: number = parseInt(process.env.PORT as string, 10) || 3000;
const server: http.Server = app.listen(port, () => {
    const address = server.address() as AddressInfo;
    console.log(`App running on port ${address.port}....`);
});

// Uncaught exception - these are exceptions that are generated due to synchronous code, for example, console.log(x) where x is undefined
process.on('uncaughtException', (err: Error) => {
    console.error(err.name, err.message);
    console.error('Uncaught Exception! Shutting down....');
    process.exit(1);
});

// Unhandled rejection - these are errors generated when some promises are rejected but not handled, leading to unhandled rejections
process.on('unhandledRejection', (err: Error) => {
    console.error(err.name, err.message);
    console.error('Unhandled Rejection! Shutting down....');
    server.close(() => {
        process.exit(1); 
    });
});

