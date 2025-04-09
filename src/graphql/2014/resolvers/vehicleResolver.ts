import EquipmentCategoryModel from '@/models/2014/equipmentCategory';
import { equipmentFieldResolvers } from './common';

import { Equipment } from '@/models/2014/equipment';

const VehicleResolver = {
  ...equipmentFieldResolvers,
  vehicle_category: async (vehicle: Equipment) => {
    const index = vehicle.vehicle_category?.toLowerCase().replace(/\s+/g, '-').replace(/,/g, '');
    return await EquipmentCategoryModel.findOne({ index }).lean();
  },
};

export default VehicleResolver;
