const dotenv = require('dotenv');

// Uncaught exception - this are exception that are generated due to synch code, for ex - console.log(x) and where x is undefined
// eslint-disable-next-line no-undef
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception! Shutting down....');
    // eslint-disable-next-line no-undef
    process.exit(1);
});

dotenv.config({
    path: './.env'
});

const app = require('./app');

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}....`);
});

// Unhandled rejection - this are errors, and are generated when some promise are rejected but not handled therefore lead to unhandle rejection
// eslint-disable-next-line no-undef
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection! Shutting down....');
    server.close(() => {
        // eslint-disable-next-line no-undef
        process.exit(1); 
    });
});