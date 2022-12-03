import EquipmentCategoryModel from '../../models/equipmentCategory/index.js';
import { equipmentFieldResolvers } from './common.js';

import { Equipment } from '../../models/equipment/types';

const Vehicle = {
  ...equipmentFieldResolvers,
  vehicle_category: async (vehicle: Equipment) => {
    const index = vehicle.vehicle_category
      ?.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/,/g, '');
    return await EquipmentCategoryModel.findOne({ index }).lean();
  },
};

export default Vehicle;
