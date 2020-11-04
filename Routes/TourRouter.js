const express = require('express');
const tourController = require('../Controllers/tourController');
const router = express.Router();

router.route('/').get(tourController.getAllTour).post(tourController.createNewTour);

router.route('/:id').get(tourController.getATour).patch(tourController.updateATour).delete(tourController.deteleTour);

module.exports = router;
