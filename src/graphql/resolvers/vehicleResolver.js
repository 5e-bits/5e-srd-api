import EquipmentCategoryModel from '../../models/equipmentCategory';
import { equipmentFieldResolvers } from './common';

const Vehicle = {
  ...equipmentFieldResolvers,
  vehicle_category: async vehicle => {
    const index = vehicle.vehicle_category
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/,/g, '');
    return await EquipmentCategoryModel.findOne({ index }).lean();
  },
};

export default Vehicle;
