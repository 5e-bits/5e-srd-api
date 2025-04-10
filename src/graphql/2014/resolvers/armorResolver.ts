import EquipmentCategoryModel from '@/models/2014/equipmentCategory';
import { Equipment } from '@/models/2014/equipment';
import { equipmentFieldResolvers } from './common';

const ArmorResolver = {
  ...equipmentFieldResolvers,
  armor_category: async (armor: Equipment) => {
    let index = armor.armor_category?.toLowerCase();
    index += index === 'shield' ? 's' : '-armor';
    return await EquipmentCategoryModel.findOne({ index }).lean();
  },
};

export default ArmorResolver;
