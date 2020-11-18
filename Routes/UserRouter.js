const express = require('express');
const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require('../Controllers/userController');
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

router.route('/resetpassword/:token').patch(resetPassword);

router.route('/updatepassword').patch(verifyToken, updatePassword);

router.route('/signup').post(signup);

router.route('/login').post(login);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
