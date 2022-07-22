import { resolveSpells } from './common';

const MagicSchool = {
  spells: async (school, args) => await resolveSpells(args, [{ 'school.index': school.index }]),
};

export default MagicSchool;
