const { readCmpLayouts } = require('../read');
const _ = require('lodash');
const replace = require('replace-in-file');

const filesToChange = '/Users/dongkyun/Documents/Projects/gordonReplace/scss/testString.scss';
// const filesToChange = './scss/testString.scss';
// const filesToChange = '/Users/dongkyun/Documents/Projects/wi-new-dashboard/src/stylesNew/componentsClass.scss';

module.exports = function runComponents(path) {
  try {
    console.log('start to read components');
    const colorResults = replace.sync({
      files: path ? path : filesToChange,
      from: readCmpLayouts(),
      to: (match) => {
        const res1 = match.replace('$', '');
        const res2 = _.camelCase(res1);
        const res3 = `\${layouts.${res2}}`
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

