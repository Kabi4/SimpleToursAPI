const express = require('express');
const tourController = require('../Controllers/tourController');
const router = express.Router();

router.route('/top-5-tours').get(tourController.topFiveTours, tourController.getAllTour);

router.route('/app-stats').get(tourController.appStats);

router.route('/yearly-stats/:year').get(tourController.yearlyStats);

router.route('/').get(tourController.getAllTour).post(tourController.createNewTour);

router.route('/:id').get(tourController.getATour).patch(tourController.updateATour).delete(tourController.deteleTour);

module.exports = router;
