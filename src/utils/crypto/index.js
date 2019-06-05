const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('config');

/** @description Generates random string of characters i.e salt.
 * @param {number} length - Length of the random string.
 * @return {string} - generated salt.
 */
const generateSalt = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length);   /** return required number of characters */
};

/** @description Hashes password with sha512.
 * @param {string} password - User password.
 * @param {string} salt - Cryptographic salt.
 * @return {{ salt, passwordHash }} - Hashed password.
 */
const sha512 = (password, salt) => {
  const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  const passwordHash = hash.digest('hex');
  return {
    salt,
    passwordHash,
  };
};

const createToken = sessionId => {
  const { jwtExpire, jwtSecret, hash, salt } = config.get('Auth');
  if (!jwtExpire || !jwtSecret) {
    throw new Error('Error generating auth token: seed data missing.');
  }
  try {
    return jwt.sign({ hash, salt, sessionId }, jwtSecret, { expiresIn: jwtExpire });
  } catch ({ message }) {
    throw new Error('Error generating auth token: jwt fail.');
  }
};

const verifyToken = token => {
  const { jwtSecret } = config.get('Auth');
  return new Promise((resolve, reject) => {
    if (!jwtSecret) {
      reject(new Error('Error decoding token: seed data missing.'));
      return;
    }
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        resolve(null);
      } else {
        resolve(decoded);
      }
    });
  });
};

const saltPassword = password => {
  const { salt } = config.get('Auth');
  return sha512(password, salt);
};

module.exports = {
  saltPassword,
  createToken,
  verifyToken,
};
