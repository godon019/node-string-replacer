
const _ = require('lodash');
const matchAll = require('string.prototype.matchall');
const { escapeRegExp } = require('./regexUtil.js');

const addImport = require('./addImport');
const readRef = require('./read');
const replace = require('./replace');
const argv = require('yargs').argv

// eslint-disable-next-line no-console
console.log('argv', argv);

const path =
  argv.path;
// '/Users/dongkyun/Documents/Projects/wi-new-dashboard/src/components/Checkbox/Checkbox.scss';
// '/Users/dongkyun/Documents/Projects/gordonReplace/scss/testString.scss';

const sassVarCase = /(?<m>\$(?:[a-z\d]+-*)+)/;

// the order matters
const run = {
  color: true,
  components: true,
  extends: true,
  mixins: true,
  localDeclarationVariables: true,
  localVariables: true,
}


// color
if (run.color) replace({
  title: 'COLOR',
  path,
  from: readRef({
    refPath: './references/colors.scss',
    regex: new RegExp(sassVarCase, 'gm'),
  }),
  to: (match) => {
    console.group(`color`);
    const res1 = match.replace('$', '');
    const res2 = _.camelCase(res1);
    const res3 = `\${({ theme }) => theme.colors.${res2}}`
    console.log(`ori: ${match} \n└-> ${res3}\n`);
    console.groupEnd();
    return res3;
  },
});

// components (layout)
if (run.components) {
  if (replace({
    title: 'COMPONENTS(LAYOUT)',
    path,
    from: readRef({
      refPath: './references/components.scss',
      regex: new RegExp(sassVarCase, 'gm'),
    }),
    to: (match) => {
      console.group(`layout`);
      const res1 = match.replace('$', '');
      const res2 = _.camelCase(res1);
      const res3 = `\${layouts.${res2}}`
      console.log(`ori: ${match} \n└-> ${res3}\n`);
      console.groupEnd();
      return res3;
    },
  })) {
    addImport({
      refPath: path,
      strToCheck: `import { layouts } from`,
      strToAppend: `import { layouts } from '../../stylesNew/components/variables';`
    })
  };
}

// extends
if (run.extends) {
  if (replace({
    title: 'EXTENDS',
    path,
    from: [/\@extend %page-index/g, /\@extend %component-defaults/g, /\@extend %component-input-defaults/g],
    to: (match) => {
      // todo: this may contain some error too. there is an exception
      console.group(`extends`);
      const res1 = match.replace('@extend %', '');
      const res2 = _.camelCase(res1);
      const res3 = `\${extends.${res2}}`
      console.log(`ori: ${match} \n└-> ${res3}\n`);
      console.groupEnd();
      return res3;
    },
  })) {
    addImport({
      refPath: path,
      strToCheck: `import * as extends from`,
      strToAppend: `import * as extends from '../../stylesNew/components/extends';`
    })
  }
}

// mixins
if (run.mixins) {
  if (replace({
    title: 'MIXINS',
    path,
    from: readRef({
      refPath: './references/mixins.scss',
      // this is a bit different fro kebab-case 
      regex: /@mixin (?<m>(?:[a-zA-z\d]+-*)+)/gm,
      returnForm: (refs) => refs.map(ref => `@include (?<m1>${ref})\\((?<m2>.*)\\);`)
    }),
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
  })) {
    addImport({
      refPath: path,
      strToCheck: `import * as mixins from`,
      strToAppend: `import * as mixins from '../../stylesNew/mixins';`
    })
  }
}

const declared = [];
// local declaration variables
if (run.localDeclarationVariables) {

  replace({
    title: 'LOCAL DECLARAION VARIABLES',
    path,
    /**
     * $vertical-margin: 20px;
     * $default-check-padding: 2em;
     * $default-check-border-radius: 2rem;
     * $default-margin-between-check-and-content: 8px; 
     */
    from: /(^\$(?:[a-z\d]+-*)+)\: (.*);/gm,
    to: (...args) => {
      console.group(`local declaratin variables`)
      console.log(`ori: ${args[0]}`);
      console.log('args[1]', args[1]);
      console.log('args[2]', args[2]);

      const res = `const ${_.camelCase(args[1])}: '${args[2]}';`;
      console.log(`└-> ${res}\n`);
      console.groupEnd();
      declared.push(new RegExp(escapeRegExp(args[1]), 'gm'));
      return res;
    },
  });
}

// local variables
if (run.localVariables) {
  // run it only when `declared` exists
  if (declared.length) {
    // eslint-disable-next-line no-console
    console.log('declared', declared);
    replace({
      title: 'LOCAL',
      path,
      from: declared,
      to: (match) => {
        console.group(`layout`);

        // $kebab-case  ->  ${kebabCase}
        const res1 = match.replace('$', '');
        const res2 = _.camelCase(res1);
        const res3 = `\${${res2}}`

        console.log(`ori: ${match} \n└-> ${res3}\n`);
        console.groupEnd();
        return res3;
      },
    });
  }
}

        // runMixins();
        // runExtends();
