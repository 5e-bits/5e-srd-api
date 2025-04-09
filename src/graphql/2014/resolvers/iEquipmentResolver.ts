import { resolveEquipmentType } from './common';
import { Equipment } from '@/models/2014/equipment';

const IEquipmentResolver = {
  __resolveType(equipment: Equipment) {
    return resolveEquipmentType(equipment);
  },
};

export default IEquipmentResolver;
