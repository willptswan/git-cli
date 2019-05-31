// Packages
const Prompt = require('prompt-async');
const Store = require('data-store');
const store = new Store({ path: '/Users/youtube/git-config.json'});
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Handler
exports.handler = async (version) => {

  console.log('Checking config...');

  // Get the stored config
  const config = store.get('git');

  // Display the username for this config
  console.log('');
  console.log(`Username: ${config.name}`);
  console.log('');

  // Ask if this config is correct
  Prompt.start();

  try {

    let response = await Prompt.get({
      name: 'correct',
      description: 'Is this the correct config? Y/n',
      required: true
    });

    if (response.correct.toLowerCase() === 'y') {

      console.log('Config checked');

      // Add files
      await addFiles();

      // Commit
      await commitFiles(version);

      // Push
      await pushFiles();

    } else {
      throw 'Please use git-cli config <name> to set the correct config'
    }

  } catch(err) {
    throw err;
  }

}

// Push files
async function pushFiles() {

  console.log('Pushing files');

  const { stdout, stderr } = await exec('git push');
  console.log('Files pushed');

}

// Commit files
async function commitFiles(version) {

  console.log(`Comitting version ${version}...`);

  const { stdout, stderr } = await exec(`git commit -m "${version}"`);

  if (stderr) {
    throw stderr;
  } else {
    console.log(`Version ${version} committed`);
  }

}

// Add files
async function addFiles() {

  console.log('Adding files...');

  const { stdout, stderr } = await exec('git add -A');

  if (stderr) {
    throw stderr;
  } else {
    console.log('Files added');
  }

}
