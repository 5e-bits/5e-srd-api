import { resolveSpells, SpellQuery } from './common.js';
import { MagicSchool } from '@/models/2014/magicSchool/types.js';

const MagicSchool = {
  spells: async (school: MagicSchool, args: SpellQuery) =>
    await resolveSpells(args, [{ 'school.index': school.index }]),
};

export default MagicSchool;
