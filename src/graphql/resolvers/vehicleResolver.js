const EquipmentCategory = require('../../models/equipmentCategory');
const { equipmentFieldResolvers } = require('./common');

const Vehicle = {
  ...equipmentFieldResolvers,
  vehicle_category: async vehicle => {
    const index = vehicle.vehicle_category
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/,/g, '');
    return await EquipmentCategory.findOne({ index }).lean();
  },
};

module.exports = Vehicle;
