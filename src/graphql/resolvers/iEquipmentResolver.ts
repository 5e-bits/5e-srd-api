import { resolveEquipmentType } from './common.js';
import { Equipment } from '../../models/equipment/types';

const IEquipment = {
  __resolveType(equipment: Equipment) {
    return resolveEquipmentType(equipment);
  },
};

export default IEquipment;
