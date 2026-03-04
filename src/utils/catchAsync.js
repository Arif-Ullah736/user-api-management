// Wraps async controller functions to eliminate try/catch
// Any error thrown inside will automatically go to the global error handler

const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;
