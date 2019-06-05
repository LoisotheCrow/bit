const API = require('../../services/API');
const logger = require('../../utils/logger');

const getBots = async (req, res) => {
  try {
    const bots = Object.keys(API.bots).map(key => {
      const bot = API.bots[key];
      return {
        id: bot.id,
        ads: bot.posts,
        maxPrice: bot.maxPrice,
        paused: bot.paused,
        lastSuccess: bot.lastUpdated,
      };
    });
    res.status(200).json(bots);
  } catch ({ message }) {
    logger.log('error', `Failed to get bots by request: ${message}.`);
    res.status(500).send('Unexpected service error.');
  }
};

module.exports = getBots;
