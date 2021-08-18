const EquipmentCategory = require('../../models/equipmentCategory');
const { equipmentFieldResolvers } = require('./common');

const Tool = {
  ...equipmentFieldResolvers,
  tool_category: async tool => {
    let index = tool.tool_category
      .replace(/\s+/g, '-')
      .replace(/'/g, '')
      .toLowerCase();
    if (index.charAt(index.length - 1) !== 's') index += 's';
    return await EquipmentCategory.findOne({ index }).lean();
  },
};

module.exports = Tool;
