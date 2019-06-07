/** @description Initializes service.
 */
const initialize = () => {
  const logger = require('./src/utils/logger');
  try {
    logger.log('info', 'Starting service...');

    const express = require('express');
    const bodyParser = require('body-parser');
    const path = require('path');
    const http = require('http');
    const config = require('config');
    const methods = require('./src/methods');

    const checkAuth = require('./src/middleware/auth/checkAuthMiddleware');
    const logRequest = require('./src/middleware/common/logRequest');

    /** @description Creates Express Application and sets up parsers to handle requests.
     */
    const _createApp = () => {
      logger.log('info', 'Creating Express application...');
      try {
        const app = express();
        logger.log('info', 'Created Express application.');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        logger.log('info', 'Connected json and urlencoded parsers.');
        return app;
      } catch ({ message }) {
        logger.log('error', `Error while trying to create Express application: ${message}.`);
        throw new Error('Express initialization error.');
      }
    };

    /** @description Connects directory to serve static from.
     * @param app
     * @private
     */
    const _addStatic = app => {
      logger.log('info', 'Connecting static directory...');
      try {
        app.use(express.static(path.join(__dirname, './Frontend/dist')));
        logger.log('info', 'Connected static directory.');
      } catch ({ message }) {
        logger.log('error', `Error while trying to set up static directory: ${message}.`);
      }
    };

    /** @description Hooks request-response middleware methods to the express Application.
     * @param {Express_Application} app
     * @private
     */
    const _addMethods = app => {
      //Remove CORS protection.
      app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, authorization');
        next();
      });

      methods.forEach(({ method, handler, noAuth, url }) => {
        app[method](url, noAuth ? [logRequest, handler] : [logRequest, checkAuth, handler]);
      });
    };

    /** @description Tries to retrieve configuration from config module, uses hardcoded default otherwise.
     * @returns {{port: number}|Object}
     * @private
     */
    const _retrieveConfig = () => {
      const _defaults = { port: 8000 };
      logger.log('info', 'Retrieving configuration...');
      if (config.has('Server')) {
        try {
          const configuration = config.get('Server');
          logger.log('info', 'Successfully retrieved server configuration.');
          return configuration;
        } catch ({ message }) {
          logger.log('error', `Error while retrieving server configuration: ${message}. Falling back on defaults...`);
          return _defaults;
        }
      } else {
        logger.log('warning', 'Server configuration is missing, falling back on defaults...');
        return _defaults;
      }
    };

    /** @description Initializes HTTP server, uses express Application and listens.
     * @param {Express_Application} app
     * @private
     */
    const _connectServer = app => {
      const { port } = _retrieveConfig();
      try {
        const server = http.createServer(app).listen(process.env.port || port);
        server.on('error', ({ message }) => {
          logger.log('error', `Error in service runtime: ${message}.`);
        });
        logger.log('info', `Initialized server, listening on port ${port}.`);
      } catch ({ message }) {
        logger.log('error', `Error while initializing server on port ${port}: ${message}.`);
        throw new Error('Listen error.');
      }
    };

    const app = _createApp();
    _addStatic(app);
    _addMethods(app);
    _connectServer(app);
    logger.log('info', 'Started service.');
  } catch ({ message }) {
    logger.log('error', `Could not start service: ${message}.`);
    process.exit(1);
  }
};

initialize();

/*{
    "url": "https://localbitcoins.com",
    "hmacSecret": "7c9afadc154a2682b7ccb7adc23a0640d027e3967d7e79d971045e1fb297cdd6",
    "key": "99e595efe140d864c04d62a4bb7c80e6",
    "proxy": []
  }*/
