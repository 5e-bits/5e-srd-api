const Spell = require('../../models/spell');
const { resolveSpellsArgs } = require('./common');

const MagicSchool = {
  spells: async (school, args) =>
    await Spell.find(resolveSpellsArgs(args, [{ 'school.index': school.index }])).lean(),
};

module.exports = MagicSchool;
