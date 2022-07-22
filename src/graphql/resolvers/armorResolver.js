import EquipmentCategoryModel from '../../models/equipmentCategory';
import { equipmentFieldResolvers } from './common';

const Armor = {
  ...equipmentFieldResolvers,
  armor_category: async armor => {
    let index = armor.armor_category.toLowerCase();
    index += index === 'shield' ? 's' : '-armor';
    return await EquipmentCategoryModel.findOne({ index }).lean();
  },
};

export default Armor;
