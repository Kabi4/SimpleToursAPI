const express = require('express');
const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require('../Controllers/userController');
const router = express.Router();
const { signup } = require('../Controllers/authenticationConroller');

router.route('/signup').post(signup);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
