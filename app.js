const express = require('express');
const app = express();

const toursRouter = require('./Routes/TourRouter');
const usersRouter = require('./Routes/UserRouter');

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;
//mongodb+srv://kushagra:<password>@cluster0.mbkua.mongodb.net/test
//mongo "mongodb+srv://cluster0.mbkua.mongodb.net/<dbname>" --username kushagra
