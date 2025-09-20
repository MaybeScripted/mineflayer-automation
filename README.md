# Mineflayer Automation Bot - BASIC BRANCH

this branch serves to be used as all the basics. a "start from scratch" area. it will lack and be behind due to obvious reasons

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Mineflayer](https://img.shields.io/badge/Mineflayer-Latest-blue.svg)](https://github.com/PrismarineJS/mineflayer)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## What's This About?

a bot that does chores while you grab coffee. Eventually gonna be a swiss-army-knife of mineflayer automation.

## Setup

so, this bot is basically in two parts:
- **`modules/`** - Where the magic happens (mining, farming, spamming chat, etc.)
- **`utilities/`** - Boring but necessary stuff (event handling, error management, blah blah)

## Getting Started

```bash
./start.sh
```

That's it. Bot connects and starts working. you can try it out by saying "hi" in chat.

Manual setup if you're paranoid:
```bash
npm install
node bot.js
```

## config

Edit `bot.js` for server/username/auth stuff.

## Adding Modules

1. Create `.js` file in `modules/`
2. Copy structure from `hi-test.js`
3. Export object with `init` function
4. Bot auto-loads it

## Known Issues

**PartialReadError**: Mineflayer thing, ignore it. Doesn't break anything.