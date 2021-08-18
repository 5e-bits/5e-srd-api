const DamageType = require('../../models/damageType');
const EquipmentCategory = require('../../models/equipmentCategory');
const WeaponProperty = require('../../models/weaponProperty');
const { equipmentFieldResolvers } = require('./common');

const Weapon = {
  ...equipmentFieldResolvers,
  category_range: async weapon => {
    const indexStart = weapon.category_range.replace(/\s+/g, '-').toLowerCase();
    return await EquipmentCategory.findOne({ index: `${indexStart}-weapons` }).lean();
  },
  damage: async weapon =>
    weapon.damage
      ? {
          ...weapon.damage,
          damage_type: await DamageType.findOne({ index: weapon.damage.damage_type.index }).lean(),
        }
      : null,
  properties: async weapon =>
    await WeaponProperty.find({ index: { $in: weapon.properties.map(p => p.index) } }).lean(),
  weapon_category: async weapon =>
    await EquipmentCategory.findOne({
      index: `${weapon.weapon_category.toLowerCase()}-weapons`,
    }).lean(),
  weapon_range: weapon => weapon.weapon_range.toUpperCase(),
};

module.exports = Weapon;
