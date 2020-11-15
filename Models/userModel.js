const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'You must have a user name'],
    },
    email: {
        type: String,
        required: [true, 'You must have a email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photoUrl: {
        type: String,
        // required: [true, 'You must have a photo'],
    },
    password: {
        type: String,
        required: [true, 'You must have a Password'],
        minlength: [8, 'Atleast 8 Character'],
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function () {
                return this.password === this.confirmPassword;
            },
            message: 'Password do not match',
        },
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const hashed = await bcrypt.hash(this.password, 12);
    this.password = hashed;
    this.confirmPassword = undefined;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
