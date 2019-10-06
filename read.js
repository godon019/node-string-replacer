//https://stackabuse.com/read-files-with-node-js/
var fs = require('fs');

const read = () => {
  try {
    // copy file path: option cmd c
    // const data = fs.readFileSync('/Users/dongkyun/Documents/Projects/wi-new-dashboard/src/styles/colors.scss', 'utf8');
    const data = fs.readFileSync('./testString.scss', 'utf8');
    // console.log(data);


    // group 'm' is the matching group
    const result = data.match(/(?<m>\$(?:[a-z\d]*-*)*)/gm);

    const array = Array.from(iter); // let's turn it into array
    // console.log('array', array);

    // get the matching group of 'm'
    const result = array.map(el => el.groups.m);
    console.log(result);
    return result;

  } catch (e) {
    console.log('Error:', e.stack);
  }
}
read();

module.exports = read;