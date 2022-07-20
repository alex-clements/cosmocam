class DataStore {
  userTokens: any;
  constructor() {
    this.userTokens = {};
  }

  setToken(user: any, token: any) {
    if (this.userTokens[user]) {
      console.log("adding token to user");
      this.userTokens[user].add(token);
    } else {
      console.log("creating new user and adding token");
      this.userTokens[user] = new Set();
      this.userTokens[user].add(token);
    }
  }

  getTokens(user: any) {
    if (!this.userTokens[user]) {
      return null;
    } else {
      return this.userTokens[user];
    }
  }

  removeToken(user: any, token: any) {
    this.userTokens[user].delete(token);
  }
}

let tokenManager = new DataStore();

export default tokenManager;
