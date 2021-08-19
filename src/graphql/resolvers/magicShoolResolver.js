const Spell = require('../../models/spell');

const MagicSchool = {
  spells: async school => await Spell.find({ 'school.index': school.index }).lean(),
};

module.exports = MagicSchool;
