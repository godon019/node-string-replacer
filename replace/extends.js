const { readExtends } = require('../read');
const _ = require('lodash');
const replace = require('replace-in-file');

const filesToChange = '/Users/dongkyun/Documents/Projects/gordonReplace/scss/testString.scss';
// const filesToChange = '../scss/refactor.scss';
// const filesToChange = './scss/testString.scss';
// const filesToChange = '/Users/dongkyun/Documents/Projects/wi-new-dashboard/src/stylesNew/componentsClass.scss';

module.exports = function runExtends(path) {
  try {
    console.log('start to read extends');
    const colorResults = replace.sync({
      files: path ? path : filesToChange,
      from: readExtends(),
      to: (match) => {
        // todo: this may contain some error too. there is an exception
        console.group(`---extends---`);
        const res1 = match.replace('@extend %', '');
        const res2 = _.camelCase(res1);
        const res3 = `\${extends.${res2}}`
        console.log(`ori: ${match} \n└-> ${res3}\n`);
        console.groupEnd();
        return res3;
      },
    })
    console.log('Replacement results:', colorResults);
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}

