import { Language } from '@/models/2014/language/index.js';

const LanguageResolver = {
  type: (language: Language) => language.type.toUpperCase(),
  script: (language: Language) => (language.script ? language.script.toUpperCase() : null),
};

export default LanguageResolver;
