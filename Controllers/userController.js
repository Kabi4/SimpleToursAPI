const fs = require('fs');
const User = require('../Models/userModel');
const AppError = require('../Utils/AppError');
const catchAsync = require('../Utils/catchAsync');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

const filterUser = (user, ...args) => {
    let newUser = {};
    args.forEach((ele) => {
        if (user[ele]) {
            newUser[ele] = user[ele];
        }
    });
    return newUser;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find().select('-__v'); //Operate Query
    res.status(200).json({
        status: 'Success',
        results: users.length,
        data: {
            users: users,
        },
    });
});

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

exports.deleteUser = catchAsync(async (req, res, next) => {
    console.log('DOing');
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(200).json({
        status: 'success',
    });
});
