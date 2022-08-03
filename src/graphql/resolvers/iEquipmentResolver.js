import { resolveEquipmentType } from './common.js';

const IEquipment = {
  __resolveType(equipment) {
    return resolveEquipmentType(equipment);
  },
};

export default IEquipment;
