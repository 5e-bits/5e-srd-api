import SimpleController, { containsText } from '@/controllers/simpleController'
import Rule from '@/models/2014/rule'
import { NameDescQuerySchema } from '@/schemas/schemas'

export default new SimpleController(Rule, {
  querySchema: NameDescQuerySchema,
  filter: ({ desc }) => (desc !== undefined ? { desc: containsText(desc) } : {}),
  cache: true
})
