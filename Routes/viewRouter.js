const express = require('express');
const viewsController = require('./../Controllers/viewsController');
const authController = require('./../Controllers/authenticationConroller');
const router = express.Router();

// router.get('/', (req, res, next) => {
//     res.status(200).render('base', {
//         title: 'Exciting tours for adventurous people',
//         user: 'Kushagra',
//     });
// });

router.use(authController.isAutheticated);

router.get('/', viewsController.getOverView);

router.get('/tour/:slug', authController.verifyToken, viewsController.getTour);

router.get('/me', authController.verifyToken, viewsController.getMe);

router.route('/login').get(viewsController.loginform);

module.exports = router;
