// example module template
// copy this structure for new modules

module.exports = {
  enabled: true, // simple toggle, you can use this to enable/disable the module
  
  init(bot) {
    this.bot = bot;
    this.setupEventListeners();
  },

  setupEventListeners() {
    // listen for chat messages
    this.bot.on('chat', (username, message) => {
      if (!this.enabled) return;
      if (message === 'hi') {
        this.bot.chat('Hello there!');
      }
    });
  }
};
