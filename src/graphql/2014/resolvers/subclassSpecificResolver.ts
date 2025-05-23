import { SubclassSpecific } from '@/models/2014/level'

const SubclassSpecificResolver = {
  __resolveType(specific: SubclassSpecific) {
    if (specific.aura_range !== undefined) return 'DevotionSpecific'
    if (specific.additional_magical_secrets_max_lvl !== undefined) return 'LoreSpecific'

    return null
  }
}

export default SubclassSpecificResolver
