const e = require("express");

class DataStore {
  constructor() {
    this.userTokens = {};
  }

  setToken(user, token) {
    if (this.userTokens[user]) {
      console.log("adding token to user");
      this.userTokens[user].add(token);
    } else {
      console.log("creating new user and adding token");
      this.userTokens[user] = new Set();
      this.userTokens[user].add(token);
    }
  }

  getTokens(user) {
    if (!this.userTokens[user]) {
      return null;
    } else {
      return this.userTokens[user];
    }
  }

  removeToken(user, token) {
    this.userTokens[user].delete(token);
  }
}

let tokenManager = new DataStore();

module.exports = tokenManager;
