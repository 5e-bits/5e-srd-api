import { Option } from '@/models/2014/common'

const ProficiencyOptionResolver = {
  __resolveType(option: Option) {
    if (option.option_type === 'reference') return 'ProficiencyReferenceOption'
    if (option.option_type === 'choice') return 'ProficiencyChoiceOption'

    return null
  }
}

export default ProficiencyOptionResolver
