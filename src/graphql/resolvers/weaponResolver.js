import DamageTypeModel from '../../models/damageType/index.js';
import EquipmentCategoryModel from '../../models/equipmentCategory/index.js';
import WeaponPropertyModel from '../../models/weaponProperty/index.js';
import { coalesceFilters, equipmentFieldResolvers, resolveNameFilter } from './common.js';

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
  properties: async (weapon, args) => {
    const filters = [
      {
        index: { $in: weapon.properties.map(p => p.index) },
      },
    ];

    if (args.name) {
      const filter = resolveNameFilter(args.name);
      filters.push(filter);
    }

    return await WeaponPropertyModel.find(coalesceFilters(filters)).lean();
  },
  weapon_category: async weapon =>
    await EquipmentCategoryModel.findOne({
      index: `${weapon.weapon_category.toLowerCase()}-weapons`,
    }).lean(),
  weapon_range: weapon => weapon.weapon_range.toUpperCase(),
};

export default Weapon;
