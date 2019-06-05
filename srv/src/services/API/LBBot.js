const LBAPI = require('./LBAPI');
const logger = require('../../utils/logger');

class LBBot {
  constructor(id, securityInfo) {
    if (!id) {
      throw new Error('Could not create a bot: no seed data.');
    }
    this.id = id;
    this.API = new LBAPI(securityInfo);
    this.paused = true;
    this.timeout = null;
    this.lastUpdated = null;
    this.posts = [];
    this.maxPrice = 600000;
    this.priceStep = 1;
    this.localPosts = [];
    this.lastSuccess = false;

    this.activate = this.activate.bind(this);
    this.logic = this.logic.bind(this);
    this.pause = this.pause.bind(this);
    this.getOwnAds = this.getOwnAds.bind(this);
    this.evaluateOwnAds = this.evaluateOwnAds.bind(this);
    this.setLimit = this.setLimit.bind(this);
    this.getLocalAds = this.getLocalAds.bind(this);
    this.evaluateLocalAds = this.evaluateLocalAds.bind(this);
    this.updateOwnPrice = this.updateOwnPrice.bind(this);
    this.setPrice = this.setPrice.bind(this);
  }

  activate() {
    this.paused = false;
    this.logic();
  }

  setLimit(newLimit) {
    if (!newLimit) {
      throw new Error('Cannot set empty limit.');
    }
    this.maxPrice = newLimit;
  }

  async getOwnAds() {
    try {
      const posts = await this.API.getAds();
      if (posts && !posts.error) {
        this.posts = posts.data ? posts.data.data.ad_list : [];
      }
      this.lastUpdated = Date.now();
      this.lastSuccess = true;
      logger.log('info', `Own posts retrieval: Got ${this.posts.length} at ${new Date(this.lastUpdated)}.`);
    } catch ({ message }) {
      if (this.lastSuccess === true) {
        logger.log('error', `Failed to get ads for bot ${this.id}: ${message}.`);
      }
      this.lastSuccess = false;
    }
  }

  async getLocalAds() {
    try {
      const localPosts = await this.API.getLocalAds();
      if (localPosts && !localPosts.error) {
        this.localPosts = localPosts.data ? localPosts.data.data.ad_list : [];
      }
    } catch ({ message }) {
      if (this.lastSuccess === true) {
        logger.log('error', `Failed to get local ads for bot ${this.id}: ${message}.`);
      }
    }
  }

  evaluateLocalAds() {
    const n = this.localPosts.length;
    if (n > 0) {
      let totalPrice = 0;
      let minPrice = 0;
      let maxPrice = 0;

      this.localPosts.forEach(post => {
        const { data } = post;
        if (data) {
          const { temp_price } = data;
          const price = Number(temp_price);

          totalPrice += price;
          if (price >= maxPrice) {
            maxPrice = price;
          }
          if (price <= minPrice || !minPrice) {
            minPrice = price;
          }
        }
      });

      logger.log('info', `Looked at ${n} local ads, with an average price of ${totalPrice / n} average price, ${minPrice} minimum price and ${maxPrice} max price.`);
      logger.log('info', `PRICE TO BEAT IS ${maxPrice}.`);
      return maxPrice;
    }
    return null;
  }

  evaluateOwnAds() {
    const n = this.posts.length;
    if (n > 0) {
      let totalPrice = 0;
      let minPrice = 0;
      let maxPrice = 0;

      this.posts.forEach(post => {
        const { data } = post;
        if (data) {
          const { price_equation } = data;
          const price = Number(price_equation);

          totalPrice += price;
          if (price >= maxPrice) {
            maxPrice = price;
          }
          if (price <= minPrice || !minPrice) {
            minPrice = price;
          }
        }
      });

      logger.log('info', `Looked at ${n} own ads, with an average price of ${totalPrice / n} average price, ${minPrice} minimum price and ${maxPrice} max price.`);
    }
  }

  setPrice(price) {
    logger.log('info', `Setting price for ads at ${price}...`);
    this.posts.forEach(async post => {
      const { data = {} } = post;
      const { ad_id } = data;
      try {
        await this.API.updateAd({ ...data, price_equation: price });
      } catch ({ message }) {
        logger.log('error', `Price update error for bot ${this.id} (ad id ${ad_id}, price ${price}): ${message}`);
      }
    });
  }

  updateOwnPrice(priceToBeat) {
    if ((priceToBeat + this.priceStep) < this.maxPrice) {
      this.setPrice(priceToBeat + this.priceStep);
    } else if ((priceToBeat + this.priceStep) > this.maxPrice) {
      this.setPrice(priceToBeat);
      logger.log('warn', '!!! Maximum market price is higher than set maximum price! !!!');
    } else {
      this.setPrice(priceToBeat);
    }
  }

  async logic() {
    await this.getOwnAds();
    if (this.lastSuccess) {
      this.evaluateOwnAds();
      await this.getLocalAds();
      const priceToBeat = this.evaluateLocalAds();
      if (priceToBeat) {
        this.updateOwnPrice(priceToBeat);
      }
    }

    if (!this.paused) {
      this.timeout = setTimeout(this.logic, 1000);
    }
  }

  pause() {
    clearTimeout(this.timeout);
    this.paused = true;
  }
}

module.exports = LBBot;
