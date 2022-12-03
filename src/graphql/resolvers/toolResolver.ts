import EquipmentCategoryModel from '../../models/equipmentCategory/index.js';
import { equipmentFieldResolvers } from './common.js';

import { Equipment } from '../../models/equipment/types';

const Tool = {
  ...equipmentFieldResolvers,
  tool_category: async (tool: Equipment) => {
    let index = tool.tool_category
      ?.replace(/\s+/g, '-')
      .replace(/'/g, '')
      .toLowerCase();
    if (index?.charAt(index.length - 1) !== 's') index += 's';
    return await EquipmentCategoryModel.findOne({ index }).lean();
  },
};

export default Tool;
