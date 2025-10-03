const errorHandler = (err, req, res, next) => {
  // Only log stack in development
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
};

module.exports = errorHandler;
