const ExpertiseOption = {
  __resolveType(option) {
    if (option.option_type === 'reference') return 'ProficiencyReferenceOption';
    if (option.option_type === 'choice') return 'ProficiencyChoiceOption';
    if (option.option_type === 'multiple') return 'ExpertiseMultipleOption';

    return null;
  },
};

export default ExpertiseOption;
