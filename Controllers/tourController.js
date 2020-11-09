const Tour = require('./../Models/tourModel');
const APIFeatures = require('./../Utils/APIFeatures');

exports.getAllTour = async (req, res) => {
    // res.status(200).json({
    //     status: 'success',
    //     result: tours.length,
    //     data: {
    //         tours: tours,
    //     },
    // });
    try {
        // const tour = await Tour.find({
        //     duration: 5,
        //     difficulty: 'easy',
        // });
        //ALSO req.query =>find(req.query)
        // const tour = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
        // {difficulty: "easy",duration: { $gte: 5}}

        // const filterObjects = ['gte', 'gt', 'lt', 'lte'];
        // filterObjects.forEach((ele) => {
        //     reqQuery.replace(/ele/g, `$${ele}`);
        // });

        //let query = await Tour.find(JSON.parse(reqQuery)); //Build Query

        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().pagination();
        const tour = await features.query; //Operate Query
        res.status(200).json({
            status: 'Success',
            results: tour.length,
            data: {
                tour: tour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'Failed',
            message: 'Internal Error or wrong page visited',
        });
    }
};

exports.createNewTour = async (req, res) => {
    // Tour.create(req.body)
    //     .then((res) => {
    //         res.staus(200).json({
    //             status: 'success',
    //             newtour: res,
    //         });
    //     })
    //     .catch((err) => {
    //         res.status(404).json({
    //             status: 'failed',
    //             message: err,
    //         });
    //     });
    try {
        const newtour = await Tour.create({
            ...req.body,
        });
        res.status(200).json({
            status: 'success',
            newtour: newtour,
        });
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error,
        });
    }
};

exports.getATour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'Success',
            results: tour.length,
            data: {
                tour: tour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'Failed',
            message: "Can't find tour you looking for",
        });
    }
};

exports.updateATour = async (req, res) => {
    try {
        const tourUpdater = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'Success',
            data: {
                updatedTour: tourUpdater,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'Failed',
            message: error,
        });
    }
};

exports.deteleTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'Success',
            message: 'Deletion Successful',
        });
    } catch (error) {
        res.status(404).json({
            status: 'Failed',
            message: "Can't Find Data to delete",
        });
    }
};

exports.topFiveTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,difficulty,summary';
    next();
};

exports.appStats = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(404).json({
            status: 'Failed',
            message: 'Sorry Response failed',
        });
    }
};

exports.yearlyStats = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(404).json({
            status: 'Failed',
            message: 'Sorry Response failed',
        });
    }
};
