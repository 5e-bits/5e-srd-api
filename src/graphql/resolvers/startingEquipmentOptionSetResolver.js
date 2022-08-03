const StartingEquipmentOptionSet = {
  __resolveType(optionSet) {
    if (optionSet.option_set_type === 'equipment_category') return 'EquipmentCategoryOptionSet';
    if (optionSet.option_set_type === 'options_array') return 'EquipmentOptionSet';

    return null;
  },
};

export default StartingEquipmentOptionSet;
