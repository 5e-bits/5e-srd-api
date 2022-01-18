const { createEnumScalarType } = require('./enumFilterResolver');

const scripts = ['COMMON', 'ELVISH', 'DWARVISH', 'INFERNAL', 'DRACONIC', 'CELESTIAL'];

const getScript = value => value[0] + value.slice(1).toLowerCase();

const LanguageScriptFilter = createEnumScalarType(
  'LanguageScriptFilter',
  'LanguageScript or list of LanguageScripts',
  scripts,
  getScript
);

module.exports = LanguageScriptFilter;
