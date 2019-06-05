const uuid = require('node-uid');
const config = require('config');

const _defaultSettings = {};

class AuthState {
  constructor() {
    this.session = null;
    this.accounts = [];
    this.getAccount = this.getAccount.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.addAccount = this.addAccount.bind(this);
    this.removeAccount = this.removeAccount.bind(this);
    this.updateAccount = this.updateAccount.bind(this);
    this.killSession = this.killSession.bind(this);
    this.createSession = this.createSession.bind(this);
    this.getSession = this.getSession.bind(this);
  }

  addAccount(name, key, settings = _defaultSettings) {
    const duplicate = this.getAccount(name);
    if (!duplicate) {
      const newAccounts = [...this.accounts];
      newAccounts.push({
        name,
        key,
        settings: { ..._defaultSettings, ...settings },
      });
      this.accounts = newAccounts;
    } else {
      throw new Error('AuthState error: cannot add duplicate account.');
    }
  }

  getAccounts(condition = (() => true)) {
    return this.accounts.filter(condition);
  }

  getAccount(name) {
    const filtered = this.accounts.filter(({name: savedName}) => savedName === name);
    if (filtered.length !== 1) {
      return null;
    } else {
      return filtered[0];
    }
  }

  removeAccount(name) {
    const account = this.getAccount(name);
    if (account) {
      this.accounts = this.accounts.filter(({ name: savedName }) => savedName !== name);
    }
  }

  updateAccount(name, newKey, newSettings) {
    const account = this.getAccount(name);
    if (account) {
      const { settings: oldSettings } = account;
      this.removeAccount(name);
      this.addAccount(name, newKey, { ...oldSettings, ...newSettings });
    } else {
      throw new Error('AuthState error: cannot modify nonexistent account.');
    }
  }

  killSession() {
    this.session = null;
  }

  getSession() {
    return this.session;
  }

  createSession(hash, salt) {
    if (this.session) {
      throw new Error('AuthState error: duplicate root session.');
    } else {
      const { sessionExpire } = config.get('Auth');
      const uid = uuid();
      this.session = { salt, hash, sessionId: uid };
      setTimeout(this.killSession, sessionExpire || 6000);
      return uid;
    }
  }
}

module.exports = new AuthState();
