const mineflayer = require('mineflayer');
const { setupEventHandlers } = require('./utilities/eventHandlers');
const ModuleManager = require('./modules');

// Bot config
const bot = mineflayer.createBot({
  host: 'localhost',    // or whaterver other server to connect to
  port: 25565,
  username: 'Bot',      // bot name, can be anything if online-mode=false in server.properties. if its not, you need to use a microsoft account.
  auth: 'offline'       // 'offline' for offline mode (omg who would've fucking guessed that), and 'microsoft' for when online-mode=true
});

setupEventHandlers(bot);

// this just init's the module manager and loads modules
const moduleManager = new ModuleManager(bot);
moduleManager.loadModules();

console.log('Bot initialized with modules:', moduleManager.getAllModules());
