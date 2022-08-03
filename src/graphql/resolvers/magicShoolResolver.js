import { resolveSpells } from './common.js';

const MagicSchool = {
  spells: async (school, args) => await resolveSpells(args, [{ 'school.index': school.index }]),
};

export default MagicSchool;
