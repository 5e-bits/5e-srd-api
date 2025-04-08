import { Language } from '@/models/2014/language/types';

const LanguageResolver = {
  type: (language: Language) => language.type.toUpperCase(),
  script: (language: Language) => (language.script ? language.script.toUpperCase() : null),
};

export default LanguageResolver;
