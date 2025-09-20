// whitelist utility - bascially a list of players who can control the bot via chat

class WhitelistManager {
  constructor() {
    this.whitelistedPlayers = new Set();
    this.addDefaultPlayers();
  }

  addDefaultPlayers() {
    const defaultPlayers = [
      'MaybeScripted',
      // if you git cloned this, add your ingame name here
    ];
    
    defaultPlayers.forEach(player => this.whitelistedPlayers.add(player.toLowerCase()));
  }

  isWhitelisted(username) {
    return this.whitelistedPlayers.has(username.toLowerCase());
  }

  addPlayer(username) {
    this.whitelistedPlayers.add(username.toLowerCase());
  }

  removePlayer(username) {
    this.whitelistedPlayers.delete(username.toLowerCase());
  }

  getWhitelistedPlayers() {
    return Array.from(this.whitelistedPlayers);
  }

  clearWhitelist() {
    this.whitelistedPlayers.clear();
  }
}

// create a singleton instance
const whitelistManager = new WhitelistManager();

module.exports = whitelistManager;
