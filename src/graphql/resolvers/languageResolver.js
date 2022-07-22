const Language = {
  type: language => language.type.toUpperCase(),
  script: language => (language.script ? language.script.toUpperCase() : null),
};

export default Language;
