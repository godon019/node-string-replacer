const runColor = require('./replace/colors');
const runComponents = require('./replace/components');
const runExtends = require('./replace/extends');
const runMixins = require('./replace/mixins');
const addImport = require('./addImport');
const runLocalVariables = require('./replace/localVariables');

const readRef = require('./read');

// const path = '/Users/dongkyun/Documents/Projects/WiReactComponents2/src/components/Card/Card.tsx';
const path = '/Users/dongkyun/Documents/Projects/wi-new-dashboard/src/components/Checkbox/Checkbox.scss'

runColor({
  path,
  refs: readRef({
    refPath: './references/colors.scss',
    regex: /(?<m>\$(?:[a-z\d]*-*)*)/gm,
  })
});

if (runComponents({
  path,
  refs: readRef({
    refPath: './references/components.scss',
    regex: /(?<m>\$(?:[a-z\d]*-*)*)/gm,
  })
})) {
  addImport({
    refPath: path,
    strToCheck: `import { layouts } from`,
    strToAppend: `import { layouts } from '../../stylesNew/components/variables';`
  })
};

if (runExtends({
  path,
  refs: () => [/\@extend %page-index/g, /\@extend %component-defaults/g, /\@extend %component-input-defaults/g]
})) {
  addImport({
    refPath: path,
    strToCheck: `import * as extends from`,
    strToAppend: `import * as extends from '../../stylesNew/components/extends';`
  })
}

if (runMixins({
  path,
  refs: readRef({
    refPath: './references/mixins.scss',
    regex: /@mixin(?<m>(?:[a-zA-z\d]*-*)*)/gm,
    returnForm: (refs) => refs.map(ref => `@include (?<m1>${ref})\\((?<m2>.*)\\);`)
  })
})) {
  addImport({
    refPath: path,
    strToCheck: `import * as mixins from`,
    strToAppend: `import * as mixins from '../../stylesNew/mixins';`
  })
}

runLocalVariables({
  path,
  refs: /(\$(?:[a-z\d]*-*)*)/gm
});

        // runMixins();
        // runExtends();
