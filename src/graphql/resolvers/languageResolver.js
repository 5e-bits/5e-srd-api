const Language = {
  type: language => language.type.toUpperCase(),
  script: language => (language.script ? language.script.toUpperCase() : null),
};

module.exports = Language;
