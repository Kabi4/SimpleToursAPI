const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This Route is not defined yet.',
    });
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This Route is not defined yet.',
    });
};

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This Route is not defined yet.',
    });
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This Route is not defined yet.',
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'This Route is not defined yet.',
    });
};
