import { resolveEquipmentType } from './common.js';
import { Equipment } from '@/models/2014/equipment/types.js';

const IEquipmentBase = {
  __resolveType(equipment: Equipment) {
    if (equipment.cost) return resolveEquipmentType(equipment);
    if (equipment.index) return 'MagicItem';
    return null;
  },
};

export default IEquipmentBase;
