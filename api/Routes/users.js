const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const UserController = require('../controllers/users');

router.post('/signup', UserController.user_signup );


router.post('/login', UserController.users_login );


router.delete('/:userId', UserController.users_delete_user );

module.exports = router;