const fs = require('fs');
const path = require('path');

const conf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));

module.exports = conf;