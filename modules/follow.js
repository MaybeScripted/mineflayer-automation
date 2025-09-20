// follow module - handles @Bot follow me commands

module.exports = {
  enabled: true,
  isFollowing: false,
  targetPlayer: null,
  
  init(bot) {
    this.bot = bot;
    this.setupEventListeners();
  },

  setupEventListeners() {
    // listen for chat messages
    this.bot.on('chat', (username, message) => {
      if (!this.enabled) return;
      
      // check for @Bot follow me command, same for stop following.
      // it literally just checks for the words "follow me" and "stop following" in the message, what you put infront or behind the message doesnt matter. it just sees "follow me" or "stop following" in the message.
      if (message.toLowerCase().includes('@bot') && message.toLowerCase().includes('follow me')) {
        this.startFollowing(username);
        return;
      }
      
      if (message.toLowerCase().includes('@bot') && message.toLowerCase().includes('stop following')) {
        this.stopFollowing();
        return;
      }
    });
  },

  startFollowing(username) {
    if (this.isFollowing) {
      this.bot.chat(`Already following ${this.targetPlayer}. Use "@Bot stop following" to stop first.`);
      return;
    }

    this.targetPlayer = username;
    this.isFollowing = true;
    this.bot.chat(`Now following ${username}!`);
    
    // start the follow loop
    this.followLoop();
  },

  stopFollowing() {
    if (!this.isFollowing) {
      this.bot.chat("I'm not following anyone right now.");
      return;
    }

    this.isFollowing = false;
    this.bot.chat(`Stopped following ${this.targetPlayer}.`);
    this.targetPlayer = null;
  },

  followLoop() {
    if (!this.isFollowing || !this.targetPlayer) return;

    const target = this.bot.players[this.targetPlayer];
    if (!target?.entity) {
      this.bot.chat(`Can't find ${this.targetPlayer}. Stopping follow.`);
      this.stopFollowing();
      return;
    }

    const targetPos = target.entity.position;
    const botPos = this.bot.entity.position;
    const distance = botPos.distanceTo(targetPos);
    
    if (distance > 3) {
      this.bot.lookAt(targetPos);
      this.bot.setControlState('forward', true);
      this.bot.setControlState('sprint', distance > 4);
      this.bot.setControlState('jump', targetPos.y > botPos.y + 0.5);
    } else {
      this.bot.setControlState('forward', false);
      this.bot.setControlState('sprint', false);
      this.bot.setControlState('jump', false);
    }

    setTimeout(() => this.followLoop(), 100);
  }
};
