// eslint-disable-next-line no-console
console.log('Hey');

const read = require('./read');
const _ = require('lodash');

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index == 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}


//Load the library and specify options
const replace = require('replace-in-file');
const options = {
  // files: './string.js',
  files: '/Users/dongkyun/Documents/Projects/gordonReplace/string.json',
  // from: /hey/g,
  from: read(),
  to: (match) => {
    const res1 = match.replace('$', '');
    return _.camelCase(res1);
  },
};

async function run() {
  try {
    const results = await replace(options)
    console.log('Replacement results:', results);
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}

run();