import EquipmentCategoryModel from '../../models/equipmentCategory/index.js';
import { equipmentFieldResolvers } from './common.js';

const Armor = {
  ...equipmentFieldResolvers,
  armor_category: async armor => {
    let index = armor.armor_category.toLowerCase();
    index += index === 'shield' ? 's' : '-armor';
    return await EquipmentCategoryModel.findOne({ index }).lean();
  },
};

export default Armor;
