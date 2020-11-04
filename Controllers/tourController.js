const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours: tours,
        },
    });
};

exports.createNewTour = (req, res) => {
    //console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId, ...req.body });
    const newTours = [...tours, newTour];
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(newTours), (err) => {
        res.status(201).json({
            status: 'Success',
            data: {
                tour: newTour,
            },
        });
    });
};

exports.getATour = (req, res) => {
    const reqId = req.params.id * 1;
    const tour = tours.find((ele) => ele.id === reqId);
    if (!tour) {
        res.status(404).json({
            status: 'fail',
            message: "Sorry Don't Exists Any Data for that id!",
        });
    }
    res.status(200).json({
        status: 'Success',
        result: tour.length,
        data: {
            tour,
        },
    });
};

exports.updateATour = (req, res) => {
    const reqId = req.params.id * 1;
    if (reqId > tours.length) {
        res.status(404).json({
            status: 'fail',
            message: "Sorry Don't Exists Any Data for that id!",
        });
    }
    res.status(200).json({
        status: 'Success',
        data: {
            tour: '<Updated Tour>',
        },
    });
};

exports.deteleTour = (req, res) => {
    const reqId = req.params.id * 1;
    if (reqId > tours.length) {
        res.status(404).json({
            status: 'fail',
            message: "Sorry Don't Exists Any Data for that id!",
        });
    }
    res.status(204).json({
        status: 'Success',
        data: null,
    });
};
