// module loader for bot functionality - basically just loads all the modules that are in the modules directory

const path = require('path');
const fs = require('fs');

class ModuleManager {
  constructor(bot) {
    this.bot = bot;
    this.modules = new Map();
    this.modulesPath = path.join(__dirname);
  }

  loadModules() {
    const moduleFiles = fs.readdirSync(this.modulesPath)
      .filter(file => file.endsWith('.js') && file !== 'index.js');

    for (const file of moduleFiles) {
      try {
        const modulePath = path.join(this.modulesPath, file);
        const moduleName = path.basename(file, '.js');
        const module = require(modulePath);
        
        if (typeof module.init === 'function') {
          module.init(this.bot);
          this.modules.set(moduleName, module);
          console.log(`Loaded module: ${moduleName}`);
        } else {
          console.warn(`Module ${moduleName} does not export an init function`);
        }
      } catch (error) {
        console.error(`Failed to load module ${file}:`, error.message);
      }
    }
  }

  getModule(name) {
    return this.modules.get(name);
  }

  getAllModules() {
    return Array.from(this.modules.keys());
  }
}

module.exports = ModuleManager;
