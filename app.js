const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const toursRouter = require('./Routes/TourRouter');
const usersRouter = require('./Routes/UserRouter');
const AppError = require('./Utils/AppError');
const ErrorController = require('./Controllers/ErrorController');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

app.use(helmet());

app.use(express.json({ limit: '10kb' }));
app.use(express.static(`${__dirname}/public`));

const limiter = rateLimit({
    max: 100,
    windowMs: 1000 * 60 * 60,
    message: 'Too mant requests you marked as spam!Try again later',
});

app.use('/api', limiter);

app.use(mongoSanitize({}));

app.use(xss());

app.use(
    hpp({
        whitelist: ['duration', 'price', 'maxGroupSize', 'difficulty', 'ratingsAverage', 'ratingsQuantity'],
    })
);

app.use('/api/v1/tours', toursRouter);

app.use('/api/v1/users', usersRouter);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'failed',
    //     message: `Can't find "${req.originalUrl}" on this server.`,
    // });
    // const err = new Error(`Can't find "${req.originalUrl}" on this server.`);
    // err.status = 'failed';
    // err.statusCode = 404;
    // const err = new AppError(`Can't find "${req.originalUrl}" on this server.`);
    next(new AppError(`Can't find "${req.originalUrl}" on this server.`, 404));
});

app.use(ErrorController);

module.exports = app;
//mongodb+srv://kushagra:<password>@cluster0.mbkua.mongodb.net/test
//mongo "mongodb+srv://cluster0.mbkua.mongodb.net/<dbname>" --username kushagra
