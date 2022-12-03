import { resolveEquipmentType } from './common.js';
import { Equipment } from '../../models/equipment/types';

const IEquipmentBase = {
  __resolveType(equipment: Equipment) {
    if (equipment.cost) return resolveEquipmentType(equipment);
    if (equipment.index) return 'MagicItem';
    return null;
  },
};

export default IEquipmentBase;
