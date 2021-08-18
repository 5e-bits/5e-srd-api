const { resolveEquipmentType } = require('./common');

const IEquipment = {
  __resolveType(equipment) {
    return resolveEquipmentType(equipment);
  },
};

module.exports = IEquipment;
