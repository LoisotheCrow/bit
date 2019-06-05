const authService = require('../../services/auth');
const logger = require('../../utils/logger');
const { verifyToken } = require('../../utils/crypto');

const checkAuth = (req, res, next) => {
  const reject = () => res.status(401).send('');

  logger.log('info', 'Checking auth data.');

  const { headers: { authorization } } = req;
  if (!authorization) {
    logger.log('error', 'No authorization header found.');
    reject();
    return;
  }

  const validatedInfo = verifyToken(authorization);
  if (!validatedInfo) {
    logger.log('error', 'No data encoded in authorization token.');
    reject();
    return;
  }

  const session = authService.getSession();
  if (!session) {
    logger.log('error', 'No active session found.');
    reject();
    return;
  }

  const { sessionId } = session;
  const { sessionId: clientId } = validatedInfo;
  if (!sessionId || !clientId) {
    logger.log('error', 'No session data.');
    reject();
    return;
  }

  if (sessionId !== clientId) {
    logger.log('error', 'Wrong authorization data.');
    reject();
    return;
  }

  next();
};

module.exports = checkAuth;
