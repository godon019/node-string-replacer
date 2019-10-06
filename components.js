// eslint-disable-next-line no-console
console.log('Hey');

const { readComponents } = require('./read');
const _ = require('lodash');
const replace = require('replace-in-file');

const filesToChange = './scss/refactor.tsx';

const Opt = {
  files: filesToChange,
  from: readComponents(),
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