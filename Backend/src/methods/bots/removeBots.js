const API = require('../../services/API');
const logger = require('../../utils/logger');

const removeBots = (req, res) => {
  try {
    const { data = {} } = req;
    const { ids } = data;

    if (!ids) {
      API.removeAll();
    } else if (typeof ids === 'string') {
      API.removeBot(ids);
    } else {
      ids.forEach(API.removeBot);
    }

    res.status(200).send('');
  } catch ({ message }) {
    logger.log('error', `Failed to remove bots by request: ${message}.`);
    res.status(500).send('Unexpected service error.');
  }
};

module.exports = removeBots;