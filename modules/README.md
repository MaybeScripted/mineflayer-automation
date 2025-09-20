# Modules

Bot modules. Each module exports an object with init function.

```javascript
module.exports = {
  enabled: true, // simple toggle
  init: (bot) => { /* required */ }
};
```

Modules are loaded automatically by index.js.
