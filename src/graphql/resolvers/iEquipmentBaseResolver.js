const { resolveEquipmentType } = require('./common');

const IEquipmentBase = {
  __resolveType(equipment) {
    if (equipment.cost) return resolveEquipmentType(equipment);
    if (equipment.index) return 'MagicItem';
    return null;
  },
};

module.exports = IEquipmentBase;
