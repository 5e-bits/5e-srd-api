import { resolveEquipmentType } from './common.js';

const IEquipmentBase = {
  __resolveType(equipment) {
    if (equipment.cost) return resolveEquipmentType(equipment);
    if (equipment.index) return 'MagicItem';
    return null;
  },
};

export default IEquipmentBase;
