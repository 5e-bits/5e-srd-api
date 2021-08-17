const EquipmentCategory = require('../../models/equipmentCategory');

const Equipment = {
  equipment_category: async tool =>
    await EquipmentCategory.findOne({ index: tool.equipment_category.index }).lean(),
  cost: () => null,
};

module.exports = Equipment;
