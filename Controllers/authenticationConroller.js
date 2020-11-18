const jwt = require('jsonwebtoken');
const User = require('./../Models/userModel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/AppError');
const sendEmail = require('../Utils/email');
const { promisify } = require('util');
const crypto = require('crypto');

const signToken = async (id) => {
    return await jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });
    const token = await signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide a email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');
    const correct = await user.correctPassword(password, user.password);
    if (!user || !correct) {
        return next(new AppError('Invalid email or password', 401));
    }

    const token = await signToken(user._id);

    res.status(200).json({
        status: 'success',
        token: token,
    });
});

exports.verifyToken = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.replace('Bearer ', '');
    }
    if (!token) {
        return next('Invalid You are not logged in please login', 401);
    }

    const decodedData = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const ConsumerUser = await User.findById(decodedData.id);

    if (!ConsumerUser) {
        return next('User Deleted! InValid Token', 401);
    }

    if (await ConsumerUser.isChangedPass(decodedData.iat)) {
        return next('Token Expired!', 401);
    }

    req.user = ConsumerUser;
    next();
});

exports.verificationAdmin = (...args) => {
    return (req, res, next) => {
        const role = req.user.role;
        const index = args.find((ele) => ele === role);
        console.log(index);
        if (index === -1 || index === undefined) {
            return next(new AppError('You dont have permission to make this action', 403));
        } else {
            next();
        }
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        next(new AppError('No user found!!', 404));
    }
    const resetToken = user.gernateResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
    console.log(resetUrl);
    const message = `Here is your link to reset you password ${resetUrl} valid for 10 mins\nif you haven't please Ignore`;
    try {
        await sendEmail({
            email: user.email,
            subject: '<no:reply>Password Reset',
            message,
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Sending Email Failed try again later', 500));
    }
    res.status(200).json({
        status: 'success',
        message: 'Your token was mailed',
    });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetTokenExpires: { $gt: Date.now() } });
    if (!user) {
        return next(new AppError('Token is invalid or expired!', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.resetPasswordToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    const token = await signToken(user._id);

    res.status(200).json({
        status: 'success',
        token: token,
    });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
        return next(new AppError("Invlaid ID recevied can't find a user", 404));
    }
    if (!(await user.correctPassword(req.body.password, user.password))) {
        return next(new AppError('Incorrect password or userid Authentication failed', 401));
    }
    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    const token = await signToken(user._id);

    res.status(200).json({
        status: 'success',
        token: token,
    });
});
