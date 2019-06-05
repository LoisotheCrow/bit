const crypto = require('crypto');
const axios = require('axios');
const qs = require('qs');
const logger = require('../../utils/logger');

class LBAPI {
  constructor(securityInfo) {
    if (!securityInfo) {
      throw new Error(`Could not create localbitcoin API handler: no seed data.`);
    }
    const { url, key, hmacSecret, proxies } = securityInfo;
    this.baseUrl = url;
    this.hmac = key;
    this.secret = hmacSecret;
    this.proxies = proxies || [];
    this.proxyIndex = 0;

    this.createAPISignature = this.createAPISignature.bind(this);
    this.requestAPI = this.requestAPI.bind(this);
    this.getAds = this.getAds.bind(this);

    logger.log('info', 'Created a localbitcoin API handler.');
  }

  createAPISignature(url, data = '') {
    const nonce = `${Date.now()}`;
    const message = nonce + this.hmac + url + qs.stringify(data);
    return {
      signature: crypto.createHmac('sha256', this.secret).update(message).digest('hex').toUpperCase(),
      nonce,
    };
  }

  async requestAPI(method, url, data = '') {
    try {
      const { nonce, signature } = this.createAPISignature(url, data);
      const config = {
        method,
        timeoutSeconds: 5,
        url: `${this.baseUrl}${url}`,
        data: qs.stringify(data),
        proxy: this.proxies.length > 0 ? this.proxies[this.proxyIndex] : null,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Apiauth-Key': this.hmac,
          'Apiauth-Nonce': nonce,
          'Apiauth-Signature': signature,
        },
      };
      const response = await axios.request(config);
      if (!response) {
        logger.log('error', `[0] Failed to access ${method} ${url}: no response.`);
        return { error: true };
      }
      const { data: responseData, error } = response;
      if (error) {
        const { message, error_code } = error;
        logger.log('error', `[1] Failed to access ${method} ${url}: code ${error_code} (${message}).`);
        return { error: true };
      }
      return { error: false, data: responseData };
    } catch ({ message, request = {} }) {
      const { statusCode, statusMessage } = request.res || {};
      logger.log('error', `[2] Failed to access ${method} ${url}: code ${statusCode} (${statusMessage}) (${message}).`);
      if (message === 'read ECONNRESET') {
        logger.log('info', 'DDOS defence could be active. Attempting to switch proxies...');
        if (this.proxies.length === 0) {
          logger.log('warn', 'No proxies found!');
        } else {
          if (this.proxyIndex >= this.proxies.length) {
            this.proxyIndex = 0;
          } else {
            this.proxyIndex += 1;
          }
          logger.log('info', `Proxies reconfigured. Current proxy is: ${this.proxies[this.proxyIndex]}`);
        }
      }
      return { error: true };
    }
  }

  async getAds(visible) {
    let result;
    try {
      result = await this.requestAPI('get', '/api/ads/', { visible });
    } catch ({ message, statusCode }) {
      throw new Error(`${statusCode ? `Code ${statusCode} ` : 'Unknown code '}(${message})`);
    }
    if (!result || result.error) {
      throw new Error(`API error`);
    }
    return result;
  }

  async getLocalAds() {
    let result;
    try {
      result = await axios.get(
    `${this.baseUrl}/sell-bitcoins-online/RU/russian_federation/.json`,
    { proxy: this.proxies.length > 0 ? this.proxies[this.proxyIndex] : null },
      );
    } catch ({ message, statusCode }) {
      throw new Error(`${statusCode ? `Code ${statusCode} ` : 'Unknown code '}(${message})`);
    }
    if (!result || result.error) {
      throw new Error(`API error`);
    }
    return result;
  }

  async updateAd(data) {
    let result;
    if (!data || !data.ad_id) {
      throw new Error('Could not update ad: no ad id or data provided.');
    }
    try {
      result = await this.requestAPI('post', `/api/ad/${data.ad_id}`, data);
    } catch ({ message, statusCode }) {
      throw new Error(`${statusCode ? `Code ${statusCode} ` : 'Unknown code '}(${message})`);
    }
    if (!result || result.error) {
      throw new Error(`API error`);
    }
    return result;
  }
}

module.exports = LBAPI;
