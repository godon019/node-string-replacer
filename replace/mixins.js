const { readMixins } = require('../read');
const _ = require('lodash');
const replace = require('replace-in-file');
const matchAll = require('string.prototype.matchall');

const filesToChange = '/Users/dongkyun/Documents/Projects/gordonReplace/scss/testString.scss';
// const filesToChange = '../scss/refactor.scss';
// const filesToChange = './scss/testString.scss';
// const filesToChange = '/Users/dongkyun/Documents/Projects/wi-new-dashboard/src/stylesNew/componentsClass.scss';

module.exports = function runMixins(path) {
  try {
    console.log('start to read extends');
    const colorResults = replace.sync({
      files: path ? path : filesToChange,
      from: readMixins(),
      // dry: true,
      to: (...args) => {
        // todo: add changing args[2] by removing ${} if it exists
        console.group(`mixin`)
        console.log(`ori: ${args[0]}`);
        console.log('args[1]', args[1]);
        console.log('args[2]', args[2]);

        
        // * check if args[2] is wrapped with ${}
        const g1 = matchAll(args[2], /(?:\${(.*)})/gm);
        const array = Array.from(g1); // let's turn it into array
        let secondCaptureGroup;
        
        if (array.length !== 0) {
          /**
           *  * case : ${layouts.borderRadiusXLarge}
           * unwrap ${}
           * layouts.borderRadiusXLarge
           */
          secondCaptureGroup = array[0][1];
          console.log(' * unwrap ${} from args[2] ->', secondCaptureGroup);
        }
        else {
          if (args[2].startsWith('$')) {
            // ! this should not happen if variable(e.g. component, color) transform is done in advance
            // * case: @include border-radius($border-radius-default);
            secondCaptureGroup = args[2];
          }
          else {
            /**
             * * @include border-radius(0.2em);
             * the 0.2em should be wrapped with colon ''
             */
            secondCaptureGroup = `'${args[2]}'`;
          }
        }

        const res = `\${mixins.${_.camelCase(args[1])}(${secondCaptureGroup})};`;
        console.log(`└-> ${res}\n`);
        console.groupEnd();
        return res;
      }
    })
    console.log('Replacement results:', colorResults);
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}

