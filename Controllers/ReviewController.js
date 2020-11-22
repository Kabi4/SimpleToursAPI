const Review = require('./../Models/reviewModel');
const catchAsync = require('../Utils/catchAsync');
// const APIFeatures = require('./../Utils/APIFeatures');
// const AppError = require('./../Utils/AppError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();
    // .populate({
    //     path: 'User',
    //     select: '-__v',
    // })
    // .populate({
    //     path: 'Tour',
    //     select: '-__v',
    // });
    res.status(200).json({
        status: 'success',
        data: {
            reviews: reviews,
        },
    });
});

exports.postAReview = catchAsync(async (req, res, next) => {
    const review = { review: req.body.review, Tour: req.body.Tour, User: req.body.User, rating: req.body.rating };
    const newReview = await Review.create({ ...review });
    res.status(201).json({
        status: 'success',
        data: {
            newReview: newReview,
        },
    });
});
