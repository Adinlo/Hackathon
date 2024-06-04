const express = require('express');

const router = express.Router();

const emailValidation = require('../middleware/validation/email-validator');
const passwordValidation = require('../middleware/validation/password-validator');
const userValidation = require('../middleware/validation/input-validator-create-user');
const authController = require('../controllers/auth');

// route to sign up
router.post('/register', userValidation, emailValidation, passwordValidation, authController.registerUser);

// route to login
router.post('/login', userValidation, emailValidation, authController.login);

module.exports = router;
