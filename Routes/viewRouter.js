const express = require('express');
const viewsController = require('./../Controllers/viewsController');
const router = express.Router();

// router.get('/', (req, res, next) => {
//     res.status(200).render('base', {
//         title: 'Exciting tours for adventurous people',
//         user: 'Kushagra',
//     });
// });

router.get('/', viewsController.getOverView);

router.get('/tour/:slug', viewsController.getTour);

module.exports = router;
