const readRef = require('../read');
const _ = require('lodash');
//Load the library and specify options
const replace = require('replace-in-file');
const filesToChange = '/Users/dongkyun/Documents/Projects/gordonReplace/scss/testString.scss';
// const filesToChange = './scss/testString.scss';
// const filesToChange = '/Users/dongkyun/Documents/Projects/wi-new-dashboard/src/stylesNew/componentsClass.scss';

module.exports = function runColor({ path, refs }) {
  try {
    console.group('START TO REPLACE COLOR VARIABLES');
    const replaceResult = replace.sync({
      files: path ? path : filesToChange,
      // from: /hey/g,
      from: refs(),
      to: (match) => {
        console.group(`color`);
        const res1 = match.replace('$', '');
        const res2 = _.camelCase(res1);
        const res3 = `\${({ theme }) => theme.colors.${res2}}`
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
// runColor();