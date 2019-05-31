// Packages
const Prompt = require('prompt-async');
const Store = require('data-store');
const store = new Store({ path: '/Users/username/git-config.json'});
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Available configs
const configs = {
  username1: {
    name: 'username1',
    email: 'emailforaccount@domain.com'
  },
  username2: {
    name: 'username2',
    email: 'emailforaccount@domain.com'
  }
};

// Handler
exports.handler = async (name) => {

  // Check configs
  console.log('Checking configs...');
  let config = {};
  if (name === 'username1') {
    config.name = configs.username1.name;
    config.email = configs.username1.email;
  } else if (name === 'username2') {
    config.name = configs.username2.name;
    config.email = configs.username2.email;
  } else {
    throw 'Please provide a valid config name';
  }

  // Ask what repo we are working on
  Prompt.start();

  try {

    let response = await Prompt.get({
      name: 'repoName',
      description: 'What repo are you working on?',
      required: true
    });

    config.repo = response.repoName;

    // Store config
    store.set('git', config);

    console.log('Configs checked');

    // Set git configs
    await setGitConfigs(config);

    // Set remote url
    await setRemoteURL(config);

  } catch(err) {
    throw err;
  }

}

async function setRemoteURL(config) {

  console.log('Setting remote url...');

  // Set remote url
  const { stdout, stderr } = await exec(`git remote set-url origin git@github.com-${config.name}:${config.name}/${config.repo}.git`);

  if (stderr) {
    throw stderr;
  } else {
    console.log('Remote url set');
  }

}

async function setGitConfigs(config) {

  console.log('Setting local and global git configs...');

  // Set global and local git configs
  const { stdout, stderr } = await exec(`git config --global user.name ${config.name}; git config --global user.email ${config.email}; git config user.name ${config.name}; git config user.email ${config.email};`);

  if (stderr) {
    throw stderr;
  } else {
    console.log('Local and global git configs set');
  }

}
