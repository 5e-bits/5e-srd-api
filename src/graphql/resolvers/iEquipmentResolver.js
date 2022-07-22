import { resolveEquipmentType } from './common';

const IEquipment = {
  __resolveType(equipment) {
    return resolveEquipmentType(equipment);
  },
};

export default IEquipment;
