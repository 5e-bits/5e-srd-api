import EquipmentModel from '../../models/equipment/index.js';
import MagicItemModel from '../../models/magicItem/index.js';
import { coalesceFilters, coalesceSort, resolveNameFilter } from './common.js';

const EquipmentCategory = {
  equipment: async (equipmentCategory, args) => {
    const indexes = equipmentCategory.equipment.map(e => e.index);
    const filters = [{ index: { $in: indexes } }];

    if (args.name) {
      const filter = resolveNameFilter(args.name);
      filters.push(filter);
    }

    const equipment = await EquipmentModel.find(coalesceFilters(filters)).lean();
    const magicItems = await MagicItemModel.find(coalesceFilters(filters)).lean();
    const equipmentToReturn = equipment.concat(magicItems);

    let sort = {};
    if (args.order) {
      sort = coalesceSort(args.order, value => value.toLowerCase(), 2);
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
        if (a.weight < b.weight) {
          return -sort.weight;
        } else if (a.weight > b.weight) {
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

export default EquipmentCategory;
