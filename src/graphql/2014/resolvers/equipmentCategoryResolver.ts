import EquipmentModel from '@/models/2014/equipment';
import MagicItemModel from '@/models/2014/magicItem';
import { coalesceFilters, coalesceSort, resolveContainsStringFilter } from './common';

import { EquipmentCategory } from '@/models/2014/equipmentCategory';
import { MagicItem } from '@/models/2014/magicItem';
import { Equipment } from '@/models/2014/equipment';
import { Order, SortQuery } from './common';

type Args = {
  name?: string;
  order?: Order;
  skip?: number;
  limit: number;
};

const EquipmentCategoryResolver = {
  equipment: async (equipmentCategory: EquipmentCategory, args: Args) => {
    const indexes = equipmentCategory.equipment.map((e) => e.index);
    const filters: any[] = [{ index: { $in: indexes } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    let equipmentToReturn: (MagicItem | Equipment)[] = [];
    const equipment = await EquipmentModel.find(coalesceFilters(filters)).lean();
    equipmentToReturn = equipmentToReturn.concat(equipment);
    const magicItems = await MagicItemModel.find(coalesceFilters(filters)).lean();
    equipmentToReturn = equipmentToReturn.concat(magicItems);

    let sort: SortQuery = {};
    if (args.order) {
      sort = coalesceSort(args.order, (value) => value.toLowerCase(), 2);
    }

    if (sort.name) {
      equipmentToReturn.sort((a, b) => {
        if (a.name < b.name) {
          return -sort.name;
        } else if (a.name > b.name) {
          return sort.name;
        } else {
          return 0;
        }
      });
    }

    if (sort.weight) {
      equipmentToReturn.sort((a, b) => {
        const aWeight = 'weight' in a ? a.weight || 0 : 0;
        const bWeight = 'weight' in b ? b.weight || 0 : 0;
        if (aWeight < bWeight) {
          return -sort.weight;
        } else if (aWeight > bWeight) {
          return sort.weight;
        } else {
          return 0;
        }
      });
    }

    let skip = 0;
    if (args.skip) {
      skip = args.skip;
    }

    return equipmentToReturn.slice(skip, skip + args.limit);
  },
};

export default EquipmentCategoryResolver;
