const EquipmentCategory = require('../../models/equipmentCategory');

const Vehicle = {
  equipment_category: async vehicle =>
    await EquipmentCategory.findOne({ index: vehicle.equipment_category.index }).lean(),
  cost: vehicle => ({ ...vehicle.cost, unit: vehicle.cost.unit.toUpperCase() }),
  vehicle_category: async vehicle => {
    const index = vehicle.vehicle_category
      .toLowerCase()
      .replace(/\s/g, '-')
      .replace(/,/g, '');
    return await EquipmentCategory.findOne({ index }).lean();
  },
};

module.exports = Vehicle;
