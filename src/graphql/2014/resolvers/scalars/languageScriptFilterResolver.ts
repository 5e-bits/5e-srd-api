import { createEnumScalarType } from './enumFilterResolver'

const scripts = ['COMMON', 'ELVISH', 'DWARVISH', 'INFERNAL', 'DRACONIC', 'CELESTIAL']

const getScript = (value: string) => value[0] + value.slice(1).toLowerCase()

const LanguageScriptFilter = createEnumScalarType(
  'LanguageScriptFilter',
  'LanguageScript ("COMMON", "ELVISH", "DWARVISH", "INFERNAL", "DRACONIC", "CELESTIAL") or list of LanguageScripts',
  scripts,
  getScript
)

export default LanguageScriptFilter
