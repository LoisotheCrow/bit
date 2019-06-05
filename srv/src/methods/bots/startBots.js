const API = require('../../services/API');
const logger = require('../../utils/logger');

const startBots = (req, res) => {
  try {
    const { data = {} } = req;
    const { ids } = data;

    if (!ids) {
      API.activateAll();
    } else if (typeof ids === 'string') {
      API.activateBot(ids);
    } else {
      ids.forEach(API.activateBot);
    }

    res.status(200).send('');
  } catch ({ message }) {
    logger.log('error', `Failed to activate bots by request: ${message}.`);
    res.status(500).send('Unexpected service error.');
  }
};

module.exports = startBots;
