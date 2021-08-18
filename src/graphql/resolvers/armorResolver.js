const EquipmentCategory = require('../../models/equipmentCategory');
const { equipmentFieldResolvers } = require('./common');

const Armor = {
  ...equipmentFieldResolvers,
  armor_category: async armor => {
    let index = armor.armor_category.toLowerCase();
    index += index === 'shield' ? 's' : '-armor';
    return await EquipmentCategory.findOne({ index }).lean();
  },
};

module.exports = Armor;
