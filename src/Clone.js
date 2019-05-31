// Packages
const Prompt = require('prompt-async');
const Store = require('data-store');
const store = new Store({ path: '/Users/youtube/git-config.json'});
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Handler
exports.handler = async (repoName) => {

  console.log('Checking config');

  // Get stored config
  const config = store.get('git');

  // Display username for the stored config
  console.log('');
  console.log(`Username: ${config.name}`);
  console.log('');

  // Ask if this correct config
  Prompt.start();

  try {

    let response = await Prompt.get({
      name: 'correct',
      description: 'Is this the correct config? Y/n',
      required: true
    });

    if (response.correct.toLowerCase() === 'y') {

      console.log('Config checked');
      console.log('Cloning repo...');

      const { stdout, stderr } = await exec(`git clone git@github.com-${config.name}:${config.name}/${repoName}.git`);

      if (stderr.includes('Cloning into')) {
        console.log('Repo cloned');
      } else {
        throw stderr;
      }

    } else {
      throw 'Please use git-cli config <name> to set the correct config';
    }

  } catch(err) {
    throw err;
  }

}
