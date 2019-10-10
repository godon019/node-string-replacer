const replace = require('replace-in-file');

module.exports = ({ title, path, from, to }) => {
  try {
    console.group(`START TO REPLACE ${title}`);
    const replaceResult = replace.sync({
      files: path ? path : filesToChange,
      from,
      to,
    })
    console.groupEnd();
    console.log(`\nReplacement results: `, replaceResult);
    console.log('\n');
    if (replaceResult[0].hasChanged) return true;
    return false;
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}