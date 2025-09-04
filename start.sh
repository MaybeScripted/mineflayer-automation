#!/bin/bash

echo "Starting Mineflayer bot..."
echo "Installing dependencies if needed..."

# this will install the dependencies if they are not already installed
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "Launching bot..."
node bot.js
