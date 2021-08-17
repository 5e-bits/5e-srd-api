const Equipment = require('../../models/equipment');
const EquipmentCategory = require('../../models/equipmentCategory');

const Gear = {
  equipment_category: async gear =>
    await EquipmentCategory.findOne({ index: gear.equipment_category.index }).lean(),
  cost: gear => ({ ...gear.cost, unit: gear.cost.unit.toUpperCase() }),
  contents: async gear =>
    gear.contents
      ? gear.contents.map(async c => ({
          quantity: c.quantity,
          item: await Equipment.findOne({ index: c.item.index }).lean(),
        }))
      : null,
  gear_category: async gear =>
    await EquipmentCategory.findOne({ index: gear.gear_category.index }).lean(),
};

module.exports = Gear;
