const EquipmentCategory = require('../../models/equipmentCategory');

const Armor = {
  equipment_category: async armor =>
    await EquipmentCategory.findOne({ index: armor.equipment_category.index }).lean(),
  cost: armor => ({ ...armor.cost, unit: armor.cost.unit.toUpperCase() }),
  armor_category: async armor => {
    let index = armor.armor_category.toLowerCase();
    index += index === 'shield' ? 's' : '-armor';
    return await EquipmentCategory.findOne({ index }).lean();
  },
};

module.exports = Armor;
