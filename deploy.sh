#!/bin/bash

# Install dependencies
npm install

# Build the project (if you have a build step)
# npm run build

# Install PM2 globally if not already installed
npm install -g pm2

# Start the application with PM2
pm2 delete gender-healthcare-api || true
pm2 start src/server.js --name gender-healthcare-api --interpreter babel-node

# Save PM2 process list and configure to start on system boot
pm2 save
pm2 startup

# Display status
pm2 status 