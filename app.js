const express = require('express');
const app = express();

const toursRouter = require('./Routes/TourRouter');
const usersRouter = require('./Routes/UserRouter');

app.use(express.json());

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;
