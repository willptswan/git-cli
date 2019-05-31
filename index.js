#!/usr/bin/env node

// Packages
const Program = require('commander');

// Src
const Config = require('./src/Config');
const Push = require('./src/Push');
const Clone = require('./src/Clone');

// CLI details
Program
  .version('1.0.0')
  .description('git-cli App');

// Config command
Program
  .command('config <name>')
  .description('Switch between configurations')
  .action((name) => {
    Config.handler(name);
  }).parse(process.argv);

// Push command
Program
  .command('push <version>')
  .description('Push changes to GitHub')
  .action((version) => {
    Push.handler(version);
  }).parse(process.argv)

// Clone command
Program
  .command('clone <repoName>')
  .description('Clone a GitHub repo')
  .action((repoName) => {
    Clone.handler(repoName);
  }).parse(process.argv);

// Parse arguments
Program.parse(process.argv);
