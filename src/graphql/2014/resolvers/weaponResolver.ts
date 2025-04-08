import DamageTypeModel from '@/models/2014/damageType/index.js';
import EquipmentCategoryModel from '@/models/2014/equipmentCategory/index.js';
import WeaponPropertyModel from '@/models/2014/weaponProperty/index.js';
import {
  coalesceFilters,
  equipmentFieldResolvers,
  resolveContainsStringFilter,
  QueryParams,
} from './common.js';

import { Equipment } from '@/models/2014/equipment/types.js';

const WeaponResolver = {
  ...equipmentFieldResolvers,
  category_range: async (weapon: Equipment) => {
    const indexStart = weapon.category_range?.replace(/\s+/g, '-').toLowerCase();
    return await EquipmentCategoryModel.findOne({ index: `${indexStart}-weapons` }).lean();
  },
  damage: async (weapon: Equipment) =>
    weapon.damage
      ? {
          ...weapon.damage,
          damage_type: await DamageTypeModel.findOne({
            index: weapon.damage.damage_type.index,
          }).lean(),
        }
      : null,
  properties: async (weapon: Equipment, args: QueryParams) => {
    const filters: any[] = [
      {
        index: { $in: weapon.properties?.map((p) => p.index) },
      },
    ];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await WeaponPropertyModel.find(coalesceFilters(filters)).lean();
  },
  weapon_category: async (weapon: Equipment) =>
    await EquipmentCategoryModel.findOne({
      index: `${weapon.weapon_category?.toLowerCase()}-weapons`,
    }).lean(),
  weapon_range: (weapon: Equipment) => weapon.weapon_range?.toUpperCase(),
};

export default WeaponResolver;
