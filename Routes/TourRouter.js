const express = require('express');
const tourController = require('../Controllers/tourController');
const router = express.Router();
const {
    verifyToken,
    verificationAdmin,
} = require('../Controllers/authenticationConroller');
// const reviewController = require('./../Controllers/ReviewController');
const reviewRouter = require('./ReviewRouter');

router.use('/:tourid/review', reviewRouter);

router
    .route('/top-5-tours')
    .get(tourController.topFiveTours, tourController.getAllTour);

router.route('/app-stats').get(tourController.appStats);

router.route('/yearly-stats/:year').get(tourController.yearlyStats);

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.toursWithin);

//tours-within?distance=233&center=-40,-45&unit-mi
router.route('/distance/:latlng/unit/:unit').get(tourController.getDistance);
router
    .route('/')
    .get(verifyToken, tourController.getAllTour)
    .post(
        verifyToken,
        verificationAdmin('admin', 'lead-guide'),
        tourController.createNewTour
    );
// router.route('/:tourid/review').post(verifyToken, reviewController.postAReview);
router
    .route('/:id')
    .get(tourController.getATour)
    .patch(
        verifyToken,
        verificationAdmin('admin', 'lead-guide'),
        tourController.updateATour
    )
    .delete(
        verifyToken,
        verificationAdmin('admin', 'lead-guide'),
        tourController.deteleTour
    );

module.exports = router;
