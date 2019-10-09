const { readColorVars } = require('../read');
const _ = require('lodash');
//Load the library and specify options
const replace = require('replace-in-file');
const filesToChange = '/Users/dongkyun/Documents/Projects/gordonReplace/scss/testString.scss';
// const filesToChange = './scss/testString.scss';
// const filesToChange = '/Users/dongkyun/Documents/Projects/wi-new-dashboard/src/stylesNew/componentsClass.scss';

module.exports = function runColor(path) {
  try {
    console.log('start to read colors');
    const colorResults = replace.sync({
      files: path ? path : filesToChange,
      // from: /hey/g,
      from: readColorVars(),
      to: (match) => {
        // eslint-disable-next-line no-console
        console.log('match', match);
        const res1 = match.replace('$', '');
        const res2 = _.camelCase(res1);
        const res3 = `\${({ theme }) => theme.colors.${res2}}`
        console.log(`ori: ${match} \n└-> ${res3}`);
        return res3;
      },
    })
    console.log('Replacement results:', colorResults);
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}
// runColor();