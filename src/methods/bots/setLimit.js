const API = require('../../services/API');
const logger = require('../../utils/logger');

const setLimit = (req, res) => {
  try {
    const { data = {} } = req;
    const { id, newLimit } = data;

    if (!id) {
      res.status(400).send('Bad request.');
      logger.log('error', 'Failed to update limit: no bot id.');
      return;
    }

    const bot = API.bots[id];
    if (!bot) {
      res.status(400).send('Bad request.');
      logger.log('error', `Failed to update limit for bot with id ${id}: no such bot.`);
      return;
    }

    bot.setLimit(newLimit);

    res.status(200).send('');
  } catch ({ message }) {
    logger.log('error', `Failed to pause bots by request: ${message}.`);
    res.status(500).send('Unexpected service error.');
  }
};

module.exports = setLimit;