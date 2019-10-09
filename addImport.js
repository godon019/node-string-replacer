//https://stackabuse.com/read-files-with-node-js/
var fs = require('fs');

const { escapeRegExp } = require('./regexUtil.js');

const appendIfNotExist = ({ refPath, strToCheck, strToAppend }) => {
  try {
    const reference = fs.readFileSync(refPath, 'utf8');

    const regex = new RegExp(escapeRegExp(strToCheck), 'gm');
    const res = reference.match(regex);
    console.log(`import statement exists? -> ${res}`);
    if (res === null) {
      // insert`import * as mixins from '../../stylesNew/mixins';\n` at the top
      console.log(`append '${strToAppend}' to the file`);
      const data = reference.toString().split("\n");
      data.splice(0, 0, strToAppend);
      const text = data.join("\n");

      fs.writeFileSync(refPath, text);
      // fs.close();
    };
    console.log('\n\n\n');

    // return regexStr;

  } catch (e) {
    console.log('Error:', e.stack);
  }
}

module.exports = appendIfNotExist;
