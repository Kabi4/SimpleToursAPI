const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./../../Models/tourModel');
const User = require('./../../Models/userModel');
const Review = require('./../../Models/reviewModel');
dotenv.config({ path: './config.env' });

const allTours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const allUsers = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const allReviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then((con) => {
        console.log('DB CONNECTION SUCESSFULL');
    })
    .catch((err) => {
        console.log(err);
        console.log('DATABASE CONNECTION FAILED');
    });

const importData = async () => {
    try {
        await Tour.create(allTours);
        await User.create(allUsers, { validateBeforeSave: false });
        await Review.create(allReviews);
        console.log('Data Successfully Posted');
        process.exit();
    } catch (error) {
        console.log(error);
        console.log('Data Upload Failed');
        process.exit();
    }
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data Successfully Deleted');
        process.exit();
    } catch (error) {
        console.log(error);
        console.log('Data deletion Failed');
        process.exit();
    }
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
