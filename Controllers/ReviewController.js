const Review = require('./../Models/reviewModel');
// const catchAsync = require('../Utils/catchAsync');
// const AppError = require('../Utils/AppError');
// const APIFeatures = require('./../Utils/APIFeatures');
// const AppError = require('./../Utils/AppError');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);

exports.putParams = (req, res, next) => {
    if (req.params.tourid) {
        req.body.tour = req.params.tourid;
    }
    // if (!req.body.tour) {
    //     return next(new AppError('No Tour mentioned', 404));
    // }
    if (req.user.id) {
        req.body.user = req.user.id;
    }
    next();
};

exports.postAReview = factory.createOne(Review);
// catchAsync(async (req, res, next) => {
//     console.log(req.body);
//     // if (!req.body.user) {
//     //     return next(new AppError('No user id mentioned', 404));
//     // }
//     const review = { review: req.body.review, Tour: req.body.Tour, User: req.body.User, rating: req.body.rating };
//     const newReview = await Review.create({ ...review });
//     res.status(201).json({
//         status: 'success',
//         data: {
//             newReview: newReview,
//         },
//     });
// });

exports.deleteReveiw = factory.deleteOne(Review);

exports.getAReview = factory.getOne(Review);
