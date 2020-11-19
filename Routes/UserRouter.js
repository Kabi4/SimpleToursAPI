const express = require('express');
const { getAllUsers, updateUser, deleteUser } = require('../Controllers/userController');
const router = express.Router();
const {
    signup,
    verifyToken,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
} = require('../Controllers/authenticationConroller');

router.route('/forgotpassword').post(forgotPassword);

router.route('/deleteUser').delete(verifyToken, deleteUser);

router.route('/updateUser').patch(verifyToken, updateUser);

router.route('/resetpassword/:token').patch(resetPassword);

router.route('/updatepassword').patch(verifyToken, updatePassword);

router.route('/signup').post(signup);

router.route('/login').post(login);

router.route('/').get(getAllUsers);

router.route('/:id').patch(updateUser).delete(deleteUser);

module.exports = router;
