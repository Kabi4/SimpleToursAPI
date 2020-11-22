const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        minlength: [12, 'Review must have 12 words'],
        required: [true, 'ReView must have review'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    User: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Reviews must have a author'],
    },
    Tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Reviews must have a tour'],
    },
});

reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'Tour',
    //     select: 'name',
    // });
    this.populate({
        path: 'User',
        select: 'name photo',
    });
    next();
});

const Reviews = mongoose.model('Reviews', reviewSchema);

module.exports = Reviews;
