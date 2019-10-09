const runColor = require('./replace/colors');
const runComponents = require('./replace/components');
const runExtends = require('./replace/extends');
const runMixins = require('./replace/mixins');

const path = '/Users/dongkyun/Documents/Projects/WiReactComponents2/src/components/Card/Card.tsx';

runColor(path);
runComponents(path);
runExtends(path);
runMixins(path);

// runMixins();
// runExtends();
