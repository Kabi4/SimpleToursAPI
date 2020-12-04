const express = require('express');
const {
    getAllUsers,
    updateUser,
    deleteUser,
    resizeUserPhoto,
    updateProfilePhoto,
} = require('../Controllers/userController');

const router = express.Router();
const {
    signup,
    verifyToken,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    logout,
} = require('../Controllers/authenticationConroller');
router.route('/signup').post(signup);

router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotpassword').post(forgotPassword);

router.route('/resetpassword/:token').patch(resetPassword);

router.use(verifyToken);

router.route('/deleteUser').delete(deleteUser);

router
    .route('/updateUser')
    .patch(updateProfilePhoto, resizeUserPhoto, updateUser);

router.route('/updatepassword').patch(updatePassword);

router.route('/').get(getAllUsers);

router.route('/:id').patch(updateUser).delete(deleteUser);

module.exports = router;
