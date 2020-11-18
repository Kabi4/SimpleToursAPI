const AppError = require('./../Utils/AppError');

const sendDevError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message || 'Internal Server error :(',
        error: err,
        stack: err.stack,
    });
};

const sendProdError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message || 'Internal Server error :(',
        });
    } else {
        console.log('Error');
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
};

const handlerCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateField = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    const message = `Duplicate field value : ${value[0]} try another value`;
    return new AppError(message, 400);
};

const handleValidationError = (err) => {
    const message = 'Invalid input data: ';
    Object.keys(err.errors).map((ele) => {
        message += err.errors[ele].message;
    });
    return new AppError(message, 400);
};

const handlerJWTERROR = (err) => new AppError('Invalid Token Thrown', 401);

const handlerExpiredError = (err) => new AppError('Token expired error', 401);

const ErrorControler = (err, req, res, next) => {
    console.log(err.stack);
    // console.log('Checking error');
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV == 'development') {
        sendDevError(err, res);
    } else {
        let error = { ...err };
        if (error.name === 'CastError') error = handlerCastError(error);
        if (error.code === 11000) error = handleDuplicateField(error);
        if (error.name === 'ValidationError') error = handleValidationError(error);
        if (error.name === 'JsonWebTokenError') error = handlerJWTERROR(error);
        if (error.name === 'TokenExpiredError') error = handlerExpiredError(error);
        sendProdError(error, res);
    }
    // res.status(err.statusCode).json({
    //     status: err.status,
    //     message: err.message || 'Internal Server error :(',
    // });
    next();
};

module.exports = ErrorControler;
