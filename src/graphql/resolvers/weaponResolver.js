import DamageTypeModel from '../../models/damageType';
import EquipmentCategoryModel from '../../models/equipmentCategory';
import WeaponPropertyModel from '../../models/weaponProperty';
import { equipmentFieldResolvers } from './common';

const Weapon = {
  ...equipmentFieldResolvers,
  category_range: async weapon => {
    const indexStart = weapon.category_range.replace(/\s+/g, '-').toLowerCase();
    return await EquipmentCategoryModel.findOne({ index: `${indexStart}-weapons` }).lean();
  },
  damage: async weapon =>
    weapon.damage
      ? {
          ...weapon.damage,
          damage_type: await DamageTypeModel.findOne({
            index: weapon.damage.damage_type.index,
          }).lean(),
        }
      : null,
  properties: async weapon =>
    await WeaponPropertyModel.find({ index: { $in: weapon.properties.map(p => p.index) } }).lean(),
  weapon_category: async weapon =>
    await EquipmentCategoryModel.findOne({
      index: `${weapon.weapon_category.toLowerCase()}-weapons`,
    }).lean(),
  weapon_range: weapon => weapon.weapon_range.toUpperCase(),
};

export default Weapon;
