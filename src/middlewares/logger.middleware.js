// Custom request logger middleware
// Logs: method, URL, status code, and response time

const logger = (req, res, next) => {
  const start = Date.now();

  // runs when response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode >= 500 ? '\x1b[31m' // red
      : res.statusCode >= 400 ? '\x1b[33m' // yellow
      : res.statusCode >= 200 ? '\x1b[32m' // green
      : '\x1b[36m'; // cyan

    console.log(
      `${statusColor}[${req.method}]\x1b[0m ${req.url} → ${statusColor}${res.statusCode}\x1b[0m [${duration}ms]`
    );
  });

  next();
};

module.exports = logger;
