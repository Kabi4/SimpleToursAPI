const express = require('express');
const app = express();

const toursRouter = require('./Routes/TourRouter');
const usersRouter = require('./Routes/UserRouter');
const AppError = require('./Utils/AppError');
const ErrorController = require('./Controllers/ErrorController');

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

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
