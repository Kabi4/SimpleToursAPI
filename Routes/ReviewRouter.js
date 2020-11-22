const express = require('express');
const reviewController = require('./../Controllers/ReviewController');
const authController = require('./../Controllers/authenticationConroller');
const Router = express.Router();

Router.route('/').get(reviewController.getAllReviews).post(authController.verifyToken, reviewController.postAReview);

module.exports = Router;
