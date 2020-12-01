const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/AppError');

const APIFeatures = require('./../Utils/APIFeatures');

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        // try {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            next(new AppError(`No Document find for id ${req.params.id}`, 404));
        }
        res.status(204).json({
            status: 'Success',
            message: 'Deletion Successful',
        });
        // } catch (error) {
        //     res.status(404).json({
        //         status: 'Failed',
        //         message: "Can't Find Data to delete",
        //     });
        // }
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        // try {
        const docUpdater = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!docUpdater) {
            return next(
                new AppError(`No document find for id ${req.params.id}`, 404)
            );
        }
        res.status(200).json({
            status: 'Success',
            data: {
                updatedDoc: docUpdater,
            },
        });
        // } catch (error) {
        //     res.status(404).json({
        //         status: 'Failed',
        //         message: error,
        //     });
        // }
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create({
            ...req.body,
        });
        res.status(200).json({
            status: 'success',
            doc: doc,
        });
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
        // try {
        //     const newtour = await Tour.create({
        //         ...req.body,
        //     });
        //     res.status(200).json({
        //         status: 'success',
        //         newtour: newtour,
        //     });
        // } catch (error) {
        //     res.status(404).json({
        //         status: 'failed',
        //         message: error,
        //     });
        // }
    });

exports.getOne = (Model, populate) =>
    catchAsync(async (req, res, next) => {
        let query = await Model.findById(req.params.id);
        if (populate) {
            query = await query.populate({
                path: populate,
            });
        }
        // try {
        const doc = await query;
        // .populated({
        //     path: 'guides',
        //     select: '-__v -lastPasswordChange',
        // });
        if (!doc) {
            return next(
                new AppError(`No doc find for id ${req.params.id}`, 404)
            );
        }
        res.status(200).json({
            status: 'Success',
            results: doc.length,
            data: {
                doc: doc,
            },
        });
        // } catch (error) {
        //     res.status(404).json({
        //         status: 'Failed',
        //         message: "Can't find tour you looking for",
        //     });
        // }
    });

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        const filter = {};
        if (req.params.tourid) {
            filter = { tour: req.params.touid };
        }
        // res.status(200).json({
        //     status: 'success',
        //     result: tours.length,
        //     data: {
        //         tours: tours,
        //     },
        // });
        //try {
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

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();
        const doc = await features.query; //Operate Query
        res.status(200).json({
            status: 'Success',
            results: doc.length,
            data: {
                doc: doc,
            },
        });
        // } catch (error) {
        //     res.status(404).json({
        //         status: 'Failed',
        //         message: 'Internal Error or wrong page visited',
        //     });
        // }
    });
