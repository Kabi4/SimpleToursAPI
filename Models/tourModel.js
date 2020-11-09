const mongoose = require('mongoose');
const toursSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have Price'],
    },
    rating: {
        type: Number,
        default: 4.2,
    },
    duration: {
        type: Number,
        required: [true, 'A tour Must have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour Must have a Group Size'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour Must have a difficulty level'],
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour Must have a Summary'],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'A tour Must have a Cover Images'],
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    startDates: [Date],
});

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;

//Creating New Tour
// const testTour = new Tour({
//     name: 'The Desert Surviour',
//     price: 779.99,
// });

// testTour
//     .save()
//     .then((res) => {
//         console.log(res);
//         console.log('Tour Saved');
//     })
//     .catch((err) => {
//         console.log(err);
//         console.log('Tour Saving Failed');
//     });
