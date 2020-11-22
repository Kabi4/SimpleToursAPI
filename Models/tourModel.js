const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
//const Validator = require('validator');
const toursSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            minlength: [10, 'Name must be atleast 10 words long'],
            maxlength: [40, 'Name must not be longer than 40 words'],
            //validate: [Validator.isAlpha, 'Name must be Aplha only'],
        },
        slug: String,
        price: {
            type: Number,
            required: [true, 'A tour must have Price'],
        },
        rating: {
            type: Number,
            default: 4.2,
            min: [1, 'Rating must be above 1'],
            max: [5, 'Rating must be below 5'],
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
            enum: {
                values: ['easy', 'difficult', 'medium'],
                message: 'Choose between : Easy,Difficulty,Medium',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price / 2;
                },
                message: 'Discount price({VALUE}) is too much higher',
            },
        },
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

        startLocation: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point'],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
        guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
        reviews: [{type: mongoose.Schema.ObjectId,ref: "Reviews"}]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

toursSchema.virtual('durationWeeks').get(function () {
    const gap = parseInt(this.duration / 7) + 1 - this.duration / 7;
    const gapAlter = this.duration / 7 - parseInt(this.duration / 7);
    if (gap < 0.2 || gapAlter < 0.2) {
        return `About ${parseInt(this.duration / 7)} week`;
    }
    return `${parseInt(this.duration / 7)} week ${parseInt(gapAlter * 7 + 0.01)} days`;
});

toursSchema.virtual('reviews',{
    ref: "Reviews",
    foreignField: "Tour",
    localField: "_id"
})

toursSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// toursSchema.pre('save',function(next){
//     const guidesPromises = this.guides.map(async id=>await User.findById(id))
//     this.guides = await Promise.all(guidesPromises);
//     next();
// })

// toursSchema.pre("save",function(next){
//     console.log("We can have multiple same documents middleware")
// })

// toursSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// });

// toursSchema.pre('find', function (next) {
//     this.find({ vipTour: { $ne: true } });
//     next();
// });
// toursSchema.pre('findOne', function (next) {
//     this.find({ vipTour: { $ne: true } });
//     next();
// });

toursSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -lastPasswordChange',
    });
    next();
});

toursSchema.pre(/^find/, function (next) {
    this.find({ vipTour: { $ne: true } });
    next();
});

toursSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { vipTour: { $ne: true } } });
    next();
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
