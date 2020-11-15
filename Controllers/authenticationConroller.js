const User = require('./../Models/userModel');
const catchAsync = require('../Utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
    console.log('Body:', req.body);
    const newUser = await User.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
        },
    });
});
