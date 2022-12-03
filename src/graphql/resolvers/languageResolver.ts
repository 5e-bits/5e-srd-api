import { Language } from '../../models/language/types';

const Language = {
  type: (language: Language) => language.type.toUpperCase(),
  script: (language: Language) => (language.script ? language.script.toUpperCase() : null),
};

export default Language;
