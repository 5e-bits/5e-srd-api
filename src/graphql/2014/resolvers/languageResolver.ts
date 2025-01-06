import { Language } from '../../../models/2014/language/types';

const Language = {
  type: (language: Language) => language.type.toUpperCase(),
  script: (language: Language) => (language.script ? language.script.toUpperCase() : null),
};

export default Language;
