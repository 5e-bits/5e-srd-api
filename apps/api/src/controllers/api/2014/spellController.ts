import SimpleController from '@/controllers/simpleController'
import Spell from '@/models/2014/spell'
import { SpellIndexQuerySchema } from '@/schemas/schemas'
import { escapeRegExp } from '@/util/regex'

export default new SimpleController(Spell, {
  querySchema: SpellIndexQuerySchema,
  filter: ({ level, school }) => ({
    ...(level !== undefined && { level: { $in: level } }),
    ...(school !== undefined && {
      'school.name': { $in: school.map((s) => new RegExp(escapeRegExp(s), 'i')) }
    })
  }),
  listFields: ['level'],
  cache: true
})
