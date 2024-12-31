import { Option } from '../../../models/2014/common/types';

const EquipmentMultipleItem = {
  __resolveType(option: Option) {
    if (option.option_type === 'counted_reference') return 'CountedReferenceOption';
    if (option.option_type === 'choice') return 'EquipmentCategoryChoiceOption';

    return null;
  },
};

export default EquipmentMultipleItem;
