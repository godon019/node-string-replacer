// eslint-disable-next-line no-console
console.log('Hey');

const { readColorVars } = require('./read');
const _ = require('lodash');
//Load the library and specify options
const replace = require('replace-in-file');

const files = './scss/refactor.tsx';
// const files = './scss/testString.scss';


const Opt = {
  files: files,
  // from: /hey/g,
  from: readColorVars(),
  to: (match) => {
    const res1 = match.replace('$', '');
    const res2 = _.camelCase(res1);
    const res3 = `\${({ theme }) => theme.colors.${res2}}`
    return res3;
  },
};

async function run() {
  try {
    const colorResults = await replace(Opt)
    console.log('Replacement results:', colorResults);
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}

run();