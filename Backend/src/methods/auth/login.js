const auth = require('basic-auth');
const config = require('config');
const logger = require('../../utils/logger');
const authService = require('../../services/auth');
const { createToken, saltPassword } = require('../../utils/crypto');

const login = (req, res) => {
  const reject = () => res.status(403).send('Wrong auth info or already authorized.');

  const { pass } = auth(req) || {};

  if (!pass) {
    logger.log('error', 'No authentication data.');
    reject();
    return;
  }

  const { passwordHash } = saltPassword(pass);
  const { hash } = config.get('Auth');
  if (passwordHash !== hash) {
    logger.log('error', 'Wrong password.');
    reject();
    return;
  }

  const session = authService.getSession();
  if (session) {
    logger.log('error', 'Session already exists.');
    reject();
    return;
  }

  try {
    const sessionId = authService.createSession();
    const token = createToken(sessionId);
    res.status(200).json({ token });
    logger.log('info', 'Successful root login.')
  } catch ({ message }) {
    logger.log('error', `Error while logging in: ${message}.`);
    res.status(500).send('Unexpected service error.');
  }
};

module.exports = login;
