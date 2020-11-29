const Tour = require('./../Models/tourModel');

const catchAsync = require('../Utils/catchAsync');

const factory = require('./handlerFactory');
const AppError = require('../Utils/AppError');
exports.getAllTour = factory.getAll(Tour);

exports.createNewTour = factory.createOne(Tour);

exports.getATour = factory.getOne(Tour);

exports.updateATour = factory.updateOne(Tour);

exports.deteleTour = factory.deleteOne(Tour);
// catchAsync(async (req, res, next) => {
//     // try {
//     const tour = await Tour.findByIdAndDelete(req.params.id);
//     if (!tour) {
//         next(new AppError(`No tour find for id ${req.params.id}`, 404));
//     }
//     res.status(204).json({
//         status: 'Success',
//         message: 'Deletion Successful',
//     });
//     // } catch (error) {
//     //     res.status(404).json({
//     //         status: 'Failed',
//     //         message: "Can't Find Data to delete",
//     //     });
//     // }
// });

exports.topFiveTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,difficulty,summary';
    next();
};

exports.appStats = catchAsync(async (req, res, next) => {
    // try {
    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: { $gte: 4.5 },
            },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                toursCount: { $sum: 1 },
                ratingCount: { $sum: '$ratingsQuantity' },
                ratingAverage: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                worstRating: { $min: '$ratingsAverage' },
                bestRating: { $max: '$ratingsAverage' },
            },
        },
        {
            $sort: {
                ratingAverage: 1,
            },
        },
        // {
        //     //Stages can be Repat $match: matching state,$group: grouping and calculating stage, $sort : sorting stage
        //     $match: {
        //         _id: { $ne: 'EASY' },
        //     },
        // },
    ]);
    res.status(200).json({
        status: 'Success',
        data: {
            stats,
        },
    });
    // } catch (error) {
    //     res.status(404).json({
    //         status: 'Failed',
    //         message: 'Sorry Response failed',
    //     });
    // }
});

exports.yearlyStats = catchAsync(async (req, res, next) => {
    // try {
    const year = 1 * req.params.year;
    const stats = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                tourCount: { $sum: 1 },
                tour: { $push: '$name' },
            },
        },
        {
            $addFields: {
                month: {
                    $let: {
                        vars: {
                            month: [
                                null,
                                'January',
                                'Febuary',
                                'March',
                                'Apirl',
                                'May',
                                'June',
                                'July',
                                'August',
                                'September',
                                'October',
                                'November',
                                'December',
                            ],
                        },
                        in: {
                            $arrayElemAt: ['$$month', '$_id'],
                        },
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: {
                tourCount: -1,
            },
        },
        {
            $limit: 12,
        },
    ]);
    res.status(200).json({
        status: 'Success',
        data: {
            stats,
        },
    });
    // } catch (error) {
    //     res.status(404).json({
    //         status: 'Failed',
    //         message: 'Sorry Response failed',
    //     });
    // }
});

exports.toursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    if (!radius) {
        next(new AppError('Provide radius unit within miles(mi) or kilometers(km) and distance in number!', 400));
    }
    if ((!lat, !lng)) {
        next(new AppError('Provide a valid lattitue and longitude in lat,lng format', 400));
    }
    const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } }).select(
        'name'
    );
    res.status(200).json({
        status: 'success',
        length: tours.length,
        data: {
            tours,
        },
    });
});
