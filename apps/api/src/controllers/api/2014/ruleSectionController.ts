import SimpleController, { containsText } from '@/controllers/simpleController'
import RuleSection from '@/models/2014/ruleSection'
import { NameDescQuerySchema } from '@/schemas/schemas'

export default new SimpleController(RuleSection, {
  querySchema: NameDescQuerySchema,
  filter: ({ desc }) => (desc !== undefined ? { desc: containsText(desc) } : {}),
  cache: true
})
