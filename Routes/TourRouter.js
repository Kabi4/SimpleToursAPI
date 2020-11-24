const express = require('express');
const tourController = require('../Controllers/tourController');
const router = express.Router();
const { verifyToken, verificationAdmin } = require('../Controllers/authenticationConroller');
// const reviewController = require('./../Controllers/ReviewController');
const reviewRouter = require('./ReviewRouter');

router.use('/:tourid/review', reviewRouter);

router.route('/top-5-tours').get(tourController.topFiveTours, tourController.getAllTour);

router.route('/app-stats').get(tourController.appStats);

router.route('/yearly-stats/:year').get(tourController.yearlyStats);

router.route('/').get(verifyToken, tourController.getAllTour).post(tourController.createNewTour);
// router.route('/:tourid/review').post(verifyToken, reviewController.postAReview);
router
    .route('/:id')
    .get(tourController.getATour)
    .patch(tourController.updateATour)
    .delete(verifyToken, verificationAdmin('admin', 'lead-guide'), tourController.deteleTour);

module.exports = router;
