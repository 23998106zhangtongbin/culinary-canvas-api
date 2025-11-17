const express = require('express');
const {
  register,
  login,
  registerValidationRules,
  loginValidationRules
} = require('../controllers/authController');


const router = express.Router();


router.post('/register', registerValidationRules, register);


router.post('/login', loginValidationRules, login);


module.exports = router;