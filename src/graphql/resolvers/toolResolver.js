const EquipmentCategory = require('../../models/equipmentCategory');

const Tool = {
  equipment_category: async tool =>
    await EquipmentCategory.findOne({ index: tool.equipment_category.index }).lean(),
  cost: tool => ({ quantity: tool.cost.quantity, unit: tool.cost.unit.toUpperCase() }),
  tool_category: async tool => {
    let index = tool.tool_category
      .replace(' ', '-')
      .replace("'", '')
      .toLowerCase();
    if (index.charAt(index.length - 1) !== 's') index += 's';
    return await EquipmentCategory.findOne({ index }).lean();
  },
};

module.exports = Tool;
