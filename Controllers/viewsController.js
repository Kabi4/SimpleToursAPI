const Tour = require('./../Models/tourModel');
const catchAsync = require('./../Utils/catchAsync');
const AppError = require('./../Utils/AppError');

exports.getOverView = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();
    res.status(200).render('overview', {
        title: 'All Tours',
        tours: tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    let tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });
    if (!tour) {
        return next(new AppError('Please search for a valid tour', 400));
    }
    res.status(200).render('tour', {
        title: tour.name,
        tour,
    });
});

exports.loginform = (req, res) => {
    res.status(200).render('login', {
        title: 'Login Your Account',
    });
};
