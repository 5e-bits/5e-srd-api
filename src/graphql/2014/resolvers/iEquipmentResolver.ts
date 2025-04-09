import { resolveEquipmentType } from './common.js';
import { Equipment } from '@/models/2014/equipment/index.js';

const IEquipmentResolver = {
  __resolveType(equipment: Equipment) {
    return resolveEquipmentType(equipment);
  },
};

export default IEquipmentResolver;
