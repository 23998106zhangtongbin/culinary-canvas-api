
const errorHandler = (err, req, res, next) => {
  
  let error = {
    message: err.message || 'Server Error',
    statusCode: err.statusCode || 500 
  };

  
  if (err.name === 'ValidationError') {
    
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = messages.join(', ');
    error.statusCode = 400; 
  }

  
  if (err.code === 11000) {
    error.message = `Duplicate value for ${Object.keys(err.keyValue).join(', ')} (must be unique)`;
    error.statusCode = 400;
  }

  
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid JWT token';
    error.statusCode = 401;
  }
  if (err.name === 'TokenExpiredError') {
    error.message = 'JWT token has expired';
    error.statusCode = 401;
  }

  
  console.error(`Error: ${err.stack}`);

  
  res.status(error.statusCode).json({
    success: false,
    error: error.message
  });
};

module.exports = errorHandler;