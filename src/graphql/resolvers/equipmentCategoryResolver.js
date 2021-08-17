const Equipment = require('../../models/equipment');
const MagicItem = require('../../models/magicItem');

//TODO: handle case where equipment is magic item
const EquipmentCategory = {
  equipment: async equipmentCategory => {
    const indexes = equipmentCategory.equipment.map(e => e.index);
    const equipment = await Equipment.find({ index: { $in: indexes } }).lean();
    const magicItems = await MagicItem.find({ index: { $in: indexes } }).lean();
    return equipment.concat(magicItems);
  },
};

module.exports = EquipmentCategory;
