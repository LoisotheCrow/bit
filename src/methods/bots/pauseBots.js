const API = require('../../services/API');
const logger = require('../../utils/logger');

const pauseBots = (req, res) => {
  try {
    const { data = {} } = req;
    const { ids } = data;

    if (!ids) {
      API.pauseAll();
    } else if (typeof ids === 'string') {
      API.pauseBot(ids);
    } else {
      ids.forEach(API.pauseBot);
    }

    res.status(200).send('');
  } catch ({ message }) {
    logger.log('error', `Failed to pause bots by request: ${message}.`);
    res.status(500).send('Unexpected service error.');
  }
};

module.exports = pauseBots;