const express = require('express');
const reviewController = require('./../Controllers/ReviewController');
const authController = require('./../Controllers/authenticationConroller');
const Router = express.Router({ mergeParams: true });
Router.use(authController.verifyToken);
Router.route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.putParams, authController.verificationAdmin('user'), reviewController.postAReview);
Router.route('/:id')
    .delete(authController.verificationAdmin('user', 'admin'), reviewController.deleteReveiw)
    .get(authController.verificationAdmin('user', 'admin'), reviewController.getAReview);
module.exports = Router;
