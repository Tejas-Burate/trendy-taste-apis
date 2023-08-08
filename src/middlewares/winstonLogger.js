// const { createLogger, transports, format } = require('winston');

// const userLogger = createLogger({
//   transports: [
//     new transports.File({
//       filename: 'users.log',
//       level: 'info',
//       format: format.json(),
//       defaultMeta: { service: 'user-service' },
//     }),
//     new transports.File({
//       filename: 'users-error.log',
//       level: 'error',
//       format: format.json(),
//     }),
//   ],
// });

// module.exports = userLogger;

const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  level: 'info', // Set the logging level (options: 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
  format: format.combine(
    format.timestamp(), // Add a timestamp to log messages
    format.json() // Log messages in JSON format
  ),
  transports: [
    // new transports.Console(), // Log to the console
    new transports.File({ filename: 'error.log', level: 'error' }), // Log errors to a file
    new transports.File({ filename: 'combined.log', level: 'info' }), // Log all messages (including errors) to a file
  ],
});

module.exports = logger;
