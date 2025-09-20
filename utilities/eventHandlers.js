// event handlers for the mineflayer bot

function setupEventHandlers(bot) {
  // bot spawn event
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

  // graceful shutdown on SIGINT 
  // for you who that dont know what the fuck that is, its basically: ctrl+c (kill the process)
  process.on('SIGINT', () => {
    console.log('\nShutting down bot...');
    bot.quit();
    process.exit(0);
  });
}

module.exports = { setupEventHandlers };
