const express = require('express');
const { body } = require('express-validator/check');
const authController = require('../controller/authController');
const User = require('../model/userModel');

const router = express.Router();

router.post('/login', authController.postLogin);
router.post('/signup', [
    body('email').isEmail()
        .withMessage("Please Enter valid Email")
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userData => {
                if (userData) {
                    return Promise.reject("Email Already Exist");
                }
            });
        }).normalizeEmail(),
    body('password').trim().isLength({ min: 6 }),
    body('name').trim().not().isEmpty()
], authController.postSignUp);

module.exports = router;