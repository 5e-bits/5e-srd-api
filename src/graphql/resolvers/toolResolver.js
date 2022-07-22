import EquipmentCategoryModel from '../../models/equipmentCategory';
import { equipmentFieldResolvers } from './common';

const Tool = {
  ...equipmentFieldResolvers,
  tool_category: async tool => {
    let index = tool.tool_category
      .replace(/\s+/g, '-')
      .replace(/'/g, '')
      .toLowerCase();
    if (index.charAt(index.length - 1) !== 's') index += 's';
    return await EquipmentCategoryModel.findOne({ index }).lean();
  },
};

export default Tool;
