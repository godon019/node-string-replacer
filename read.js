//https://stackabuse.com/read-files-with-node-js/
var fs = require('fs');
const matchAll = require('string.prototype.matchall');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const readColorVars = () => {
  try {
    // copy file path: option cmd c
    // * `reference` is an reference file. which means, those matching from here is being used to change the related strings in actual files
    // const data = fs.readFileSync('/Users/dongkyun/Documents/Projects/wi-new-dashboard/src/styles/colors.scss', 'utf8');
    const reference = fs.readFileSync('./scss/string.scss', 'utf8');
    // console.log(data);


    // group 'm' is the matching group
    const iter = matchAll(reference, /(?<m>\$(?:[a-z\d]*-*)*)/gm);

    const array = Array.from(iter); // let's turn it into array
    // console.log('array', array);

    // get the matching group of 'm'
    const result = array.map(el => el.groups.m);
    console.log(result);
    const regexStr = result.map(str => new RegExp(escapeRegExp(str),'g'))
    console.log(regexStr);

    return regexStr;

  } catch (e) {
    console.log('Error:', e.stack);
  }
}
// readColorVars();


const readComponents = () => {
  try {
    // copy file path: option cmd c
    const reference = fs.readFileSync('./components/ref.scss', 'utf8');
    // console.log(data);


    // group 'm' is the matching group
    const iter = matchAll(reference, /(?<m>\$(?:[a-z\d]*-*)*)/gm);

    const array = Array.from(iter); // let's turn it into array
    // console.log('array', array);

    // get the matching group of 'm'
    const result = array.map(el => el.groups.m);
    console.log(result);
    const regexStr = result.map(str => new RegExp(escapeRegExp(str),'g'))
    console.log(regexStr);

    return regexStr;

  } catch (e) {
    console.log('Error:', e.stack);
  }
}
// readComponents();

module.exports = { readColorVars, readComponents };