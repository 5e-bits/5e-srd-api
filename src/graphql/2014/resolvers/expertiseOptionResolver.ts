import { Option } from '@/models/2014/common/types';

const ExpertiseOptionResolver = {
  __resolveType(option: Option) {
    if (option.option_type === 'reference') return 'ProficiencyReferenceOption';
    if (option.option_type === 'choice') return 'ProficiencyChoiceOption';
    if (option.option_type === 'multiple') return 'ExpertiseMultipleOption';

    return null;
  },
};

export default ExpertiseOptionResolver;
