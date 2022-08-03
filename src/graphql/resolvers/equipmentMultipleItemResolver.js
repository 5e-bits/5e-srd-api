const EquipmentMultipleItem = {
  __resolveType(option) {
    if (option.option_type === 'counted_reference') return 'CountedReferenceOption';
    if (option.option_type === 'choice') return 'EquipmentCategoryChoiceOption';

    return null;
  },
};

export default EquipmentMultipleItem;
