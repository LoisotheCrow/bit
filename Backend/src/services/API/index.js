const uuid = require('node-uid');
const config = require('config');
const logger = require('../../utils/logger');
const LBBot = require('./LBBot');

class API {
  constructor() {
    logger.log('info', 'Initializing bots...');

    this.bots = {};

    this.createBot = this.createBot.bind(this);
    this.pauseBot = this.pauseBot.bind(this);
    this.removeBot = this.removeBot.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.pauseAll = this.pauseAll.bind(this);
    this.activateAll = this.activateAll.bind(this);

    const APIConfig = config.get('LBAPI');
    if (!APIConfig) {
      throw new Error('Could not initialize API: no seed data.');
    }
    APIConfig.forEach(this.createBot);

    logger.log('info', 'Successfully initialized bots.');
  }

  createBot(securityInfo) {
    logger.log('info', 'Creating a bot...');
    const id = uuid();
    this.bots[id] = new LBBot(id, securityInfo);
    logger.log('info', `Created a bot: id ${id}.`);
  }

  activateBot(id) {
    logger.log('info', `Activating bot ${id}...`);
    const bot = this.bots[id];
    if (bot.paused) {
      bot.activate();
      logger.log('info', `Activated bot ${id}.`)
    } else {
      logger.log('warn', 'Bot already activated.');
    }

  }

  pauseBot(id) {
    logger.log('info', `Pausing bot ${id}...`);
    const bot = this.bots[id];
    bot.pause();
    logger.log('info', `Paused bot ${id}.`);
  }

  removeBot(id) {
    logger.log('info', `Removing bot ${id}...`);
    const bot = this.bots[id];
    bot.pause();
    this.bots[id] = null;
    logger.log('info', `Removed bot ${id}.`);
  }

  removeAll() {
    logger.log('info', 'Removing all bots...');
    Object.keys(this.bots).forEach(id => {
      this.removeBot(id);
    });
    logger.log('info', 'Removed all bots.');
  }

  pauseAll() {
    logger.log('info', 'Pausing all bots...');
    Object.keys(this.bots).forEach(id => {
      this.pauseBot(id);
    });
    logger.log('info', 'Paused all bots.');
  }

  activateAll() {
    logger.log('info', 'Activating all bots...');
    Object.keys(this.bots).forEach(id => {
      this.activateBot(id);
    });
    logger.log('info', 'Activated all bots.');
  }
}

module.exports = new API();
