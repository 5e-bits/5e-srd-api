import SimpleController from '@/controllers/simpleController'
import Spell2024Model from '@/models/2024/spell'
import { SpellIndexQuerySchema } from '@/schemas/schemas'
import { escapeRegExp } from '@/util/regex'

export default new SimpleController(Spell2024Model, {
  querySchema: SpellIndexQuerySchema,
  filter: ({ level, school }) => ({
    ...(level !== undefined && { level: { $in: level } }),
    ...(school !== undefined && {
      'school.name': { $in: school.map((s) => new RegExp(escapeRegExp(s), 'i')) }
    })
  }),
  listFields: ['level']
})
