// follow module. it like handles @Bot follow commands with smart pathfinding and auto-eat

const whitelist = require('../utilities/whitelist');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const Movements = require('mineflayer-pathfinder').Movements;
const { GoalFollow } = require('mineflayer-pathfinder').goals;

module.exports = {
  enabled: true,
  isFollowing: false,
  targetPlayer: null,
  targetEntity: null,
  intervals: {},
  eventsBound: false,
  
  init(bot) {
    this.bot = bot;
    bot.once('spawn', () => this.initialize());
    this.setupEventListeners();
  },

  initialize() {
    try {
      this.bot.loadPlugin(pathfinder);
      this.setupMovements();
      this.setupAutoEat();
      this.setupHumanBehaviors();
      this.setupPathfinderEvents();
    } catch (error) {
      console.error('Failed to initialize follow module:', error.message);
    }
  },

  setupMovements() {
    this.movements = new Movements(this.bot);
    Object.assign(this.movements, {
      allowSprinting: true,
      allowParkour: false,
      allowEntityDetection: true,
      canDig: false,
      allow1by1towers: false,
      allowFreeMotion: true,
      entityCost: 2,
      liquidCost: 3
    });
  },

  setupAutoEat() {
    try {
      const autoEat = require('mineflayer-auto-eat');
      this.bot.loadPlugin(autoEat.loader);
      this.bot.autoEat.setOpts({
        priority: 'saturation',
        minHunger: 15,
        minHealth: 14,
        returnToLastItem: true,
        offhand: false,
        eatingTimeout: 3000,
        bannedFood: ['rotten_flesh', 'pufferfish', 'chorus_fruit', 'poisonous_potato', 'spider_eye'],
        strictErrors: false
      });
      this.bot.autoEat.enableAuto();
    } catch (error) {
      console.log('Auto-eat not available');
    }
  },

  setupHumanBehaviors() {
    this.intervals.human = setInterval(() => {
      if (this.isFollowing && Math.random() < 0.1) this.addHumanBehavior();
    }, 2000 + Math.random() * 3000);
    
    this.intervals.look = setInterval(() => {
      if (this.isFollowing && Math.random() < 0.15) this.lookAround();
    }, 3000 + Math.random() * 4000);
  },

  addHumanBehavior() {
    if (!this.isFollowing || !this.bot.pathfinder) return;
    
    if (Math.random() < 0.3) {
      this.bot.pathfinder.setGoal(null);
      setTimeout(() => this.resumePathfinding(), 500 + Math.random() * 1000);
    }
    
    if (Math.random() < 0.2) {
      this.updateFollowDistance(1.5 + Math.random() * 2);
    }
  },

  lookAround() {
    if (!this.isFollowing) return;
    
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * Math.PI / 3;
    this.bot.look(yaw, pitch);
    
    setTimeout(() => {
      if (this.isFollowing && this.targetEntity) {
        this.bot.lookAt(this.targetEntity.position);
      }
    }, 800 + Math.random() * 1200);
  },

  setupEventListeners() {
    this.bot.on('chat', (username, message) => {
      if (!this.enabled || !whitelist.isWhitelisted(username)) return;
      
      const msg = message.toLowerCase();
      if (!msg.includes('@bot') || !msg.includes('follow')) return;
      
      if (msg.includes('stop following')) {
        this.stopFollowing();
      } else if (msg.includes('follow me')) {
        this.startFollowing(username);
      } else {
        const match = msg.match(/follow\s+(\w+)/);
        if (match) this.startFollowing(match[1]);
      }
    });
  },

  startFollowing(username) {
    const target = this.bot.players[username];
    if (!target?.entity) {
      this.bot.chat(`idk where ${username} is. They might be too far away.`);
      return;
    }

    // hot-switch if already following someone
    if (this.isFollowing) {
      this.bot.chat(`Switching from ${this.targetPlayer} to ${username}!`);
    } else {
      this.bot.chat(`Now following ${username}!`);
    }

    this.targetPlayer = username;
    this.targetEntity = target.entity;
    this.isFollowing = true;
    this.startFollowingSystem();
  },

  startFollowingSystem() {
    if (!this.bot?.pathfinder || !this.movements) {
      this.bot.chat('Pathfinder not ready. Please wait a moment.');
      this.reset();
      return;
    }

    // and also clear any existing pathfinder goal for hot-switching
    this.clearGoal();

    this.bot.pathfinder.setMovements(this.movements);
    this.startMovementSystem();
  },

  setupPathfinderEvents() {
    if (this.eventsBound) return;
    this.eventsBound = true;

    this.bot.on('goal_reached', () => {
      if (!this.isFollowing) return;
      if (Math.random() < 0.3) this.bot.chat(`I'm here!`);
      setTimeout(() => this.resumePathfinding(), 1000 + Math.random() * 2000);
    });
    
    this.bot.on('path_update', (result) => {
      if (result.status === 'noPath') {
        this.bot.chat(`Can't find a path to ${this.targetPlayer}.`);
        this.stopFollowing();
      }
    });
  },

  startMovementSystem() {
    this.intervals.movement = setInterval(() => {
      if (!this.isFollowing || !this.targetEntity) return;
      
      const target = this.bot.players[this.targetPlayer];
      if (!target?.entity) return;
      
      const distance = this.bot.entity.position.distanceTo(target.entity.position);
      
      if (distance > 3) {
        this.useDirectMovement(target.entity.position, distance);
      } else {
        this.usePathfinderMovement();
      }
    }, 200);
  },

  useDirectMovement(targetPos, distance) {
    if (this.bot.pathfinder) this.bot.pathfinder.setGoal(null);
    
    this.bot.lookAt(targetPos);
    this.bot.setControlState('forward', true);
    this.bot.setControlState('sprint', distance >= 4);
    this.bot.setControlState('jump', distance >= 6 || targetPos.y > this.bot.entity.position.y + 0.5);
  },

  usePathfinderMovement() {
    const distance = 1.5 + Math.random() * 1;
    this.setFollowGoal(distance, true);
  },

  resumePathfinding() {
    this.setFollowGoal(2, true);
  },

  updateFollowDistance(distance) {
    this.setFollowGoal(distance, true);
  },

  stopFollowing() {
    if (!this.isFollowing) {
      this.bot.chat("I'm not following anyone right now.");
      return;
    }

    this.bot.chat(`Stopped following ${this.targetPlayer}.`);
    this.reset();
  },

  reset() {
    this.clearGoal();
    
    this.bot.setControlState('forward', false);
    this.bot.setControlState('sprint', false);
    this.bot.setControlState('jump', false);
    
    this.clearIntervals();
    this.isFollowing = false;
    this.targetPlayer = null;
    this.targetEntity = null;
  },

  clearIntervals() {
    Object.values(this.intervals).forEach(interval => clearInterval(interval));
    this.intervals = {};
  },

  // helpers
  clearGoal() {
    if (this.bot?.pathfinder) this.bot.pathfinder.setGoal(null);
  },

  setFollowGoal(distance = 2, dynamic = true) {
    if (!this.isFollowing || !this.targetEntity || !this.bot?.pathfinder) return;
    const goal = new GoalFollow(this.targetEntity, distance);
    this.bot.pathfinder.setGoal(goal, dynamic);
  }
};
