const mineflayer = require('mineflayer');

// Bot config
const bot = mineflayer.createBot({
  host: 'localhost',    // or whaterver other server to connect to
  port: 25565,
  username: 'Bot',      // bot name, can be anything if online-mode=false in server.properties. if its not, you need to use a microsoft account.
  auth: 'offline'       // 'offline' for offline mode (omg who would've fucking guessed that), and 'microsoft' for when online-mode=true
});

// Event handler thingies
bot.on('spawn', () => {
  console.log('Bot has joined the server!');
  console.log(`Position: ${bot.entity.position.x}, ${bot.entity.position.y}, ${bot.entity.position.z}`);
});

bot.on('kicked', (reason) => {
  console.log(`Bot was kicked: ${reason}`);
  process.exit(1);
});

bot.on('error', (err) => {
  console.error(`An error occurred: ${err}`);
  process.exit(1);
});

bot.on('end', () => {
  console.log('Bot disconnected from server');
  process.exit(0);
});

// a simple keep alive
process.on('SIGINT', () => {
  console.log('\nShutting down bot...');
  bot.quit();
  process.exit(0);
});
