// const fs = require('fs');
const User = require('../Models/userModel');
const AppError = require('../Utils/AppError');
const catchAsync = require('../Utils/catchAsync');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const factory = require('./handlerFactory');
const multer = require('multer');
const slugify = require('slugify');
const sharp = require('sharp');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, '/public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(
//             null,
//             `${slugify(req.user.name, { lower: true })}-${
//                 req.user.id
//             }-${new Date(Date.now()).getMilliseconds()}.${ext}`
//         );
//     },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Please Choose a image to upload!', 400), false);
    }
};

const filterUser = (user, ...args) => {
    let newUser = {};
    args.forEach((ele) => {
        if (user[ele]) {
            newUser[ele] = user[ele];
        }
    });
    return newUser;
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.updateProfilePhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    const ext = req.file.mimetype.split('/')[1];
    req.file.filename = `${slugify(req.user.name, { lower: true })}-${
        req.user.id
    }-${Date.now()}.${ext}`;
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
});

exports.getAllUsers = factory.getAll(User);

exports.updateUser = catchAsync(async (req, res, next) => {
    console.log(req.file, 'BODY');
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError('Cannot manipulate passwords here!', 400));
    }
    const updatedUser = filterUser(req.body, 'name', 'email');
    if (req.file) {
        updatedUser.photo = req.file.filename;
    }
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
