const logger = require('../../utils/logger');

const logRequest = (req, res, next) => {
  const { url, method } = req;

  logger.log('info', '--------> NEXT');
  logger.log('info', `Got ${method} request on ${url}.`);

  next();
  logger.log('info', '<----------');
};

module.exports = logRequest;
