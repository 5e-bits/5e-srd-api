import { OptionSet } from '../../models/common/types';

const StartingEquipmentOptionSet = {
  __resolveType(optionSet: OptionSet) {
    if (optionSet.option_set_type === 'equipment_category') return 'EquipmentCategoryOptionSet';
    if (optionSet.option_set_type === 'options_array') return 'EquipmentOptionSet';

    return null;
  },
};

export default StartingEquipmentOptionSet;
