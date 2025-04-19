import { resolveSpells, SpellQuery } from './common'
import { MagicSchool } from '@/models/2014/magicSchool'

const MagicSchoolResolver = {
  spells: async (school: MagicSchool, args: SpellQuery) =>
    await resolveSpells(args, [{ 'school.index': school.index }])
}

export default MagicSchoolResolver
