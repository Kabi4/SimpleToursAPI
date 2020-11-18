const fs = require('fs');
const User = require('../Models/userModel');
const catchAsync = require('../Utils/catchAsync');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

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

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This Route is not defined yet.',
    });
};

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This Route is not defined yet.',
    });
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This Route is not defined yet.',
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This Route is not defined yet.',
    });
};
