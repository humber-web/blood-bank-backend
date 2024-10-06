// middleware/errorHandler.js

/**
 * Centralized Error Handling Middleware
 * Catches errors thrown in the application and sends a formatted response.
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
  
    // Set default status code and message
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({
      success: false,
      message
    });
  };
  
  module.exports = errorHandler;
  