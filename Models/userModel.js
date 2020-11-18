const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'You must have a user name'],
        unique: true,
    },
    role: {
        type: String,
        enum: ['admin', 'guides', 'lead-guider', 'user'],
        default: 'user',
    },
    email: {
        type: String,
        required: [true, 'You must have a email'],
        unique: [true, 'Email already exists'],
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
        select: false,
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
    lastPasswordChange: Date,
    resetPasswordToken: String,
    resetTokenExpires: Date,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const hashed = await bcrypt.hash(this.password, 12);
    this.password = hashed;
    this.confirmPassword = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) {
        next();
    }
    this.lastPasswordChange = Date.now() - 1000;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    const hashed = await bcrypt.compare(candidatePassword, userPassword);
    return hashed;
};

userSchema.methods.isChangedPass = async function (tokenExpiryTime) {
    if (this.lastPasswordChange) {
        return this.lastPasswordChange.getTime() / 1000 > tokenExpiryTime;
    }
    return false;
};

userSchema.methods.gernateResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetTokenExpires = Date.now() + 10 * 60 * 100;
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
