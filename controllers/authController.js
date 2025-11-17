const User = require('../models/User');
const { body, validationResult } = require('express-validator'); 


exports.register = async (req, res, next) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    
    const { username, email, password } = req.body;

    
    const existingUser = await User.findOne({
      $or: [{ email }, { username }] 
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or username already exists'
      });
    }

    
    const user = await User.create({
      username,
      email,
      password
    });

    
    const token = user.getSignedJwtToken();

    
    res.status(201).json({ 
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    
    next(error);
  }
};


exports.login = async (req, res, next) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    
    const { email, password } = req.body;

    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials (email not found)'
      });
    }

    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials (wrong password)'
      });
    }

    
    const token = user.getSignedJwtToken();

    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};


exports.registerValidationRules = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];


exports.loginValidationRules = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];