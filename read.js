//https://stackabuse.com/read-files-with-node-js/
var fs = require('fs');
const matchAll = require('string.prototype.matchall');

// function escapeRegExp(string) {
//   return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
// }

const { escapeRegExp } = require('./regexUtil.js');

const readRef = ({ refPath, regex, returnForm }) => {
  try {
    // copy file path: option cmd c
    // * `reference` is an reference file. which means, those matching from here is being used to change the related strings in actual files
    // const data = fs.readFileSync('/Users/dongkyun/Documents/Projects/wi-new-dashboard/src/styles/colors.scss', 'utf8');
    const reference = fs.readFileSync(refPath, 'utf8');
    // console.log(data);


    // group 'm' is the matching group
    const iter = matchAll(reference, regex);
    1
    const array = Array.from(iter); // let's turn it into array
    // console.log('array', array);

    // get the matching group of 'm'
    let result = array.map(el => el.groups.m);
    // console.log(`read ${refPath}`, result);

    result = result.map(str => escapeRegExp(str));
    // console.log('after escape: \n', result);

    if (returnForm !== undefined) {
      // console.log(`set up return forms: \n`);
      result = returnForm(result);
      // console.log(result);
    }

    const regexStr = result.map(str => new RegExp(str, 'g'))
    // console.log(regexStr);

    return regexStr;

  } catch (e) {
    // console.log('Error:', e.stack);
  }
}

module.exports = readRef;

// module.exports = {
//   readColorVars: readRef({
//     refPath: './references/colors.scss',
//     regex: /(?<m>\$(?:[a-z\d]*-*)*)/gm,
//   }),
//   readCmpLayouts: readRef({
//     refPath: './references/components.scss',
//     regex: /(?<m>\$(?:[a-z\d]*-*)*)/gm,
//   }),
//   readExtends: () => [/\@extend %page-index/g, /\@extend %component-defaults/g, /\@extend %component-input-defaults/g],
//   readMixins: readRef({
//     refPath: './references/mixins.scss',
//     regex: /@mixin (?<m>(?:[a-zA-z\d]*-*)*)/gm,
//     returnForm: (refs) => refs.map(ref => `@include (?<m1>${ref})\\((?<m2>.*)\\);`),
//   }),
//   // readLocalDeclarations: readRef()
// };

/**
 * ! Caveat
 * `color` and `layouts` filter lower cases
 * `extends` don't use regex but return manually written strings
 * `mixins` filter lower and higher cases as well
 */