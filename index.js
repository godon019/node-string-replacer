
const _ = require('lodash');
const matchAll = require('string.prototype.matchall');
const { escapeRegExp } = require('./regexUtil.js');

const addImport = require('./addImport');
const readRef = require('./read');
const replace = require('./replace');
const argv = require('yargs').argv;
const path = require('path');
const fs = require('fs');

console.log('argv', argv);

const originalPath =
  argv.path;
// '/Users/dongkyun/Documents/Projects/wi-new-dashboard/src/components/Checkbox/Checkbox.scss';
// '/Users/dongkyun/Documents/Projects/gordonReplace/scss/testString.scss';

const savePath = path.dirname(originalPath) + '/styles.ts';

// generally used type
const sassVarCase = /(?<m>\$(?:[a-z\d]+-*)+)/;

// destination.txt will be created or overwritten by default.
fs.copyFileSync(originalPath, savePath);
console.log(`${originalPath} was copied to ${savePath}`);

// the order matters
const run = {
  color: true,
  components: true,
  extends: true,
  mixins: true,
  localDeclarationVariables: true,
  localVariables: true,
  localMixinsRef: true,
  localMixins: true,
}

// make sure to use escape with \ one more time
// this function will remove the bug of
// light}er type transformation
const matchExactVariable = (refs) => refs.map(ref => `${ref}(?![\\w\\d-])`);

// color
if (run.color) replace({
  title: 'COLOR',
  path: savePath,
  from: readRef({
    refPath: './references/colors.scss',
    regex: new RegExp(sassVarCase, 'gm'),
    returnForm: matchExactVariable,
  }),
  to: (match) => {
    console.group(`color`);
    const res1 = match.replace('$', '');
    const res2 = _.camelCase(res1);
    const res3 = `\${({ theme }): string => theme.colors.${res2}}`
    // const res3 = `\${({ theme: { colors } }) => colors.${res2}}`

    console.log(`ori: ${match} \n└-> ${res3}\n`);
    console.groupEnd();
    return res3;
  },
});

// components (layouts)
if (run.components) {
  replace({
    title: 'COMPONENTS(LAYOUT)',
    path: savePath,
    from: readRef({
      refPath: './references/components.scss',
      regex: new RegExp(sassVarCase, 'gm'),
      returnForm: matchExactVariable,
    }),
    to: (match) => {
      console.group(`layout`);
      const res1 = match.replace('$', '');
      const res2 = _.camelCase(res1);
      // const res3 = `\${layouts.${res2}}`
      const res3 = `\${({ theme }): string => theme.layouts.${res2}}`

      console.log(`ori: ${match} \n└-> ${res3}\n`);
      console.groupEnd();
      return res3;
    },
  })
}

// extends
if (run.extends) {
  if (replace({
    title: 'EXTENDS',
    path: savePath,
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
      refPath: savePath,
      strToCheck: `import * as styleExtends from`,
      strToAppend: `import * as styleExtends from '../../stylesNew/components/extends';`
    })
  }
}

// mixins
if (run.mixins) {
  if (replace({
    title: 'MIXINS',
    path: savePath,
    from: readRef({
      refPath: './references/mixins.scss',
      // this is a bit different fro kebab-case 
      regex: /@mixin (?<m>(?:[a-zA-z\d]+-*)+)/gm,
      // make sure to use escape with \ one more time
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
        console.log(' * unwrap ${} from args[2] to ->', secondCaptureGroup);
      }
      else {
        if (args[2].startsWith('$')) {
          // ! this should not happen if variable(e.g. component, color) transform is done in advance
          // * case: @include border-radius($border-radius-default);
          secondCaptureGroup = args[2];
        }
        else {
          if (!args[2]) {
            // if argument was empty then stay empty
            // user-select-none() => user-select-none()
            secondCaptureGroup = ''
          } else {
            /**
               * * @include border-radius(0.2em);
               * the 0.2em should be wrapped with colon ''
               * there the 'large' kind of thing too
               * remove ' from all and then wrap it with '' again
               */
            // the second replace() does replace , to ', ' 
            secondCaptureGroup = `'${args[2].replace(/\'/gm, '').replace(/, /gm, '\', \'')}'`;
          }
        }
      }

      let res

      console.group('check if it has \'({ theme }\): string =>\'');
      const matchTheme = matchAll(secondCaptureGroup, /(?<m1>\({ theme }\): string => )(?<m2>.+)/gm);
      const matchThemeArray = Array.from(matchTheme);

      if (matchThemeArray.length !== 0) {
        // * case: ${mixins.borderRadius(({ theme }): string => theme.layouts.borderRadiusDefault)};
        // that should be like
        // * return:  ${({ theme }): string => mixins.borderRadius(theme.layouts.borderRadiusDefault)};
        // assume the unwrapping ${} function has already done
        // args[1]: border-radius
        // secondCaptureGroup: ({ theme }): string => theme.layouts.borderRadiusDefault
        // so
        // <func1>
        // check if secondCaptureGroup has ({ theme }): string =>
        // seperate into thirdCaptureGroup as  ({ theme }): string =>
        // seperate into fourthCaptureGroup as  theme.layouts.borderRadiusDefault
        // replace `string` on thirdCaptueGroup to `FlattenSimpleInterpolation`
        // <end of func1>

        const thirdCaptureGroup = matchThemeArray[0].groups.m1.replace('string', 'FlattenSimpleInterpolation');
        const fourthCaptureGroup = matchThemeArray[0].groups.m2;
        console.log(`thirdCaptureGroup : '${thirdCaptureGroup}'`)
        console.log(`fourthCaptureGroup : '${fourthCaptureGroup}'`)

        res = `\${${thirdCaptureGroup}mixins.${_.camelCase(args[1])}(${fourthCaptureGroup})};`;

      } else {
        res = `\${mixins.${_.camelCase(args[1])}(${secondCaptureGroup})};`;
      }
      console.groupEnd();

      console.log(`└-> ${res}\n`);
      console.groupEnd();
      return res;
    }
  })) {
    addImport({
      refPath: savePath,
      strToCheck: `import * as mixins from`,
      strToAppend: `import * as mixins from '../../stylesNew/mixins';`
    })
  }
}

const localVariables = [];
// local declaration variables
if (run.localDeclarationVariables) {

  replace({
    title: 'LOCAL DECLARAION VARIABLES',
    path: savePath,
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

      const res = `const ${_.camelCase(args[1])} = '${args[2]}';`;
      console.log(`└-> ${res}\n`);
      console.groupEnd();
      localVariables.push(new RegExp(escapeRegExp(args[1]), 'gm'));
      return res;
    },
  });
}

// local variables
if (run.localVariables) {
  // run it only when `declared` exists
  if (localVariables.length) {
    // eslint-disable-next-line no-console
    console.log('declared', localVariables);
    replace({
      title: 'LOCAL',
      path: savePath,
      from: localVariables,
      returnForm: matchExactVariable,
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


const localMixinsImplementation = [];
// local mixins declaration
if (run.localMixinsRef) {
  replace({
    title: 'LOCAL MIXINS REF',
    path: savePath,
    from: /@mixin (?<m>(?:[a-zA-z\d]+-*)+)(?<m2>\(.*\)) {/gm,
    to: (...args) => {

      // @mixin height-yo($size) {
      //   something
      // }
      // to
      // const heightYo = ($size) => css`
      //   something
      // }
      // ! note that the transforming from { } to css`` is not perfect, need to change the rest of it manually

      // todo: add changing args[2] by removing ${} if it exists
      console.group(`local mixins ref`)
      // @mixin height-yo($size) {
      console.log(`ori: ${args[0]}`);
      // height-yo
      console.log('args[1]', args[1]);
      // ($size)
      console.log('args[2]', args[2]);

      const res = `const ${_.camelCase(args[1])} = ${args[2]} => css\``;
      console.log(`└-> ${res}\n`);
      console.groupEnd();
      // push height-yo to use it at local mixins transforming
      localMixinsImplementation.push(new RegExp(`@include (?<m1>${escapeRegExp(args[1])})\\((?<m2>.*)\\);`, 'gm'));
      return res;
    }
  })
}


// local mixins
if (run.localMixins) {
  if (localMixinsImplementation) {
    replace({
      title: 'LOCAL MIXINS',
      path: savePath,
      from: localMixinsImplementation,
      to: (...args) => {
        // // todo: add changing args[2] by removing ${} if it exists
        // console.group(`local mixin`)
        // console.log(`ori: ${args[0]}`);
        // console.log('args[1]', args[1]);
        // console.log('args[2]', args[2]);

        // const res = `\${${_.camelCase(args[1])}(${args[2]})};`;
        // console.log(`└-> ${res}\n`);
        // console.groupEnd();
        // return res;

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
              * there the 'large' kind of thing too
              * remove ' from all and then wrap it with '' again
              */
            // the second replace() does replace , to ', ' 
            secondCaptureGroup = `'${args[2].replace(/\'/gm, '').replace(/, /gm, '\', \'')}'`;
          }
        }

        const res = `\${${_.camelCase(args[1])}(${secondCaptureGroup})};`;
        console.log(`└-> ${res}\n`);
        console.groupEnd();
        return res;
      }
    })
  } else {
    console.log('NO LOCAL MIXINS DECLARED TO TRANSFORM')
  }
}

addImport({
  refPath: savePath,
  strToCheck: `import styled`,
  strToAppend: `import styled, { FlattenSimpleInterpolation, css } from 'styled-components';`
})