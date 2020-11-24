// const fs = require('fs');
const User = require('../Models/userModel');
const AppError = require('../Utils/AppError');
const catchAsync = require('../Utils/catchAsync');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const factory = require('./handlerFactory');
const filterUser = (user, ...args) => {
    let newUser = {};
    args.forEach((ele) => {
        if (user[ele]) {
            newUser[ele] = user[ele];
        }
    });
    return newUser;
};

exports.getAllUsers = factory.getAll(User);

exports.updateUser = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError('Cannot manipulate passwords here!', 400));
    }
    const updatedUser = filterUser(req.body, 'name', 'email');

    const newuser = await User.findByIdAndUpdate(req.user.id, updatedUser, {
        runValidators: true,
        new: true,
    });
    res.status(200).json({
        status: 'success',
        data: {
            updateUser: newuser,
        },
    });
});

exports.deleteUser = factory.deleteOne(User);
// catchAsync(async (req, res, next) => {
//     console.log('DOing');
//     await User.findByIdAndUpdate(req.user.id, { active: false });
//     res.status(200).json({
//         status: 'success',
//     });
// });

exports.getMe = factory.getOne(User);
