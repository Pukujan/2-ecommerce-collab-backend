const express = require('express')
const userController = require('../controllers/userController');
const router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const check = require('../middleware/checkAuth');

//validator for resgistering and login

const registerSchema = Joi.object().keys({
  fullname: Joi.string().min(5).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(20).required()
});


const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(20).required()
});

//routes

const methodNotAllowed = (req, res) => res.status(405).json({ 'message': 'method not allowed' });


router.route('/api/userLogin').post(validator.body(loginSchema), userController.userLogin).all(methodNotAllowed);
router.route('/api/userSignUp').post(validator.body(registerSchema), userController.userSignUp).all(methodNotAllowed);
router.route('/api/updateUser').patch(check.checkUser, userController.updateUserProfile).all(methodNotAllowed);

//get loggedIn userinfo

router.route('/api/getUser').get(check.checkUser, userController.getUserById).all(methodNotAllowed);

//get all userinfo
router.route('/api/users').get(check.checkAdmin, userController.getUsers).all(methodNotAllowed);



module.exports = router;




