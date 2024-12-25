import { resolveEquipmentType } from './common.js';
import { Equipment } from '../../models/2014/equipment/types.js';

const IEquipment = {
  __resolveType(equipment: Equipment) {
    return resolveEquipmentType(equipment);
  },
};

export default IEquipment;
