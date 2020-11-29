const mongoose = require('mongoose');
const Tour = require('./tourModel');

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
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Reviews must have a author'],
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Reviews must have a tour'],
    },
});

reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

reviewSchema.static.calcAverageRating = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: {
                tour: tourId,
            },
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                averageRating: { $avg: '$rating' },
            },
        },
    ]);
    if (stats[0]) {
        await Tour.findByIdAndUpdate({ ratingsAverage: stats[0].nRating, ratingsQuantity: stats[0].averageRating });
    } else {
        await Tour.findByIdAndUpdate({ ratingsAverage: 4.5, ratingsQuantity: 0 });
    }
};

reviewSchema.post('save', function () {
    this.constructor.calcAverageRating(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRating(this.r.tour);
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
