const login = require('./auth/login');
const getBots = require('./bots/getBots');
const startBots = require('./bots/startBots');
const pauseBots = require('./bots/pauseBots');
const removeBots = require('./bots/removeBots');
const setLimit = require('./bots/setLimit');

module.exports = [
  {
    method: 'post',
    handler: login,
    url: '/login',
    noAuth: true,
  },
  {
    method: 'get',
    handler: getBots,
    url: '/bots',
    noAuth: true,
  },
  {
    method: 'post',
    handler: startBots,
    url: '/bots/activate',
    noAuth: true,
  },
  {
    method: 'post',
    handler: pauseBots,
    url: '/bots/pause',
    noAuth: true,
  },
  {
    method: 'post',
    handler: removeBots,
    url: '/bots/remove',
    noAuth: true,
  },
  {
    method: 'post',
    handler: setLimit,
    url: '/bots/limit',
    noAuth: true,
  },
];
