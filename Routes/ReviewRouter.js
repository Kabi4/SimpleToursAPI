const express = require('express');
const reviewController = require('./../Controllers/ReviewController');
const authController = require('./../Controllers/authenticationConroller');
const Router = express.Router({ mergeParams: true });

Router.route('/')
    .get(reviewController.getAllReviews)
    .post(authController.verifyToken, reviewController.putParams, reviewController.postAReview);
Router.route('/:id').delete(reviewController.deleteReveiw).get(reviewController.getAReview);
module.exports = Router;
