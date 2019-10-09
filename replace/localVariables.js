const { readCmpLayouts } = require('../read');
const _ = require('lodash');
const replace = require('replace-in-file');

const filesToChange = '/Users/dongkyun/Documents/Projects/gordonReplace/scss/testString.scss';

module.exports = function runComponents({ path, refs }) {
  try {
    console.group('START TO REPLACE LOCAL VARIABLES');
    const replaceResult = replace.sync({
      files: path ? path : filesToChange,
      from: refs,
      to: (match) => {
        console.group(`layout`);
        const res1 = match.replace('$', '');
        const res2 = _.camelCase(res1);
        const res3 = `\${${res2}}`
        console.log(`ori: ${match} \n└-> ${res3}\n`);
        console.groupEnd();
        return res3;
      },
    })
    console.groupEnd();
    console.log(`\nReplacement results: `, replaceResult);
    console.log('\n');
    if (replaceResult[0].hasChanged) return true;
    return false;
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}

