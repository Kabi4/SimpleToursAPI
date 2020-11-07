const express = require('express');
const tourController = require('../Controllers/tourController');
const router = express.Router();

const checkBody = (req, res, next) => {
    const body = req.body;
    if (!body.price || !body.name) {
        return res.status(404).json({
            status: 'Invalid Data',
            message: 'Invalid Data Recived make sure you contain NAME AND PRICE',
        });
    }
    next();
};

router.route('/').get(tourController.getAllTour).post(checkBody, tourController.createNewTour);

router.route('/:id').get(tourController.getATour).patch(tourController.updateATour).delete(tourController.deteleTour);

module.exports = router;
