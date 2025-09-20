// follow module - handles @Bot follow commands

const whitelist = require('../utilities/whitelist');

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
      
      // check if player is whitelisted
      if (!whitelist.isWhitelisted(username)) {
        return; // and then just silently ignore non-whitelisted players
      }
      
      const msg = message.toLowerCase();
      
      // check for @Bot follow commands
      if (msg.includes('@bot') && msg.includes('follow')) {
        if (msg.includes('stop following')) {
          this.stopFollowing();
          return;
        }
        
        // check for "follow me", it auto corrects to the person who sent the message
        if (msg.includes('follow me')) {
          this.startFollowing(username);
          return;
        }
        
        // check for "follow <player>", it extracts the player name
        const followMatch = msg.match(/follow\s+(\w+)/);
        if (followMatch) {
          const targetPlayer = followMatch[1];
          this.startFollowingPlayer(targetPlayer);
          return;
        }
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

  startFollowingPlayer(targetPlayer) {
    if (this.isFollowing) {
      this.bot.chat(`Already following ${this.targetPlayer}. Use "@Bot stop following" to stop first.`);
      return;
    }

    // check if target player is in range (rendered in)
    const target = this.bot.players[targetPlayer];
    if (!target?.entity) {
      this.bot.chat(`I don't know where ${targetPlayer} is. They might be too far away.`);
      return;
    }

    this.targetPlayer = targetPlayer;
    this.isFollowing = true;
    this.bot.chat(`Now following ${targetPlayer}!`);
    
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
