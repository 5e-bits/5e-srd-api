const { resolveSpells } = require('./common');

const MagicSchool = {
  spells: async (school, args) => await resolveSpells(args, [{ 'school.index': school.index }]),
};

module.exports = MagicSchool;
