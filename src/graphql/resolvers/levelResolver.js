import ClassModel from '../../models/class/index.js';
import FeatureModel from '../../models/feature/index.js';
import SubclassModel from '../../models/subclass/index.js';
import { coalesceFilters, getMongoSortDirection, resolveNameFilter } from './common.js';

const Level = {
  class: async level => await ClassModel.findOne({ index: level.class.index }).lean(),
  subclass: async level =>
    level.subclass ? await SubclassModel.findOne({ index: level.subclass.index }).lean() : null,
  features: async (level, args) => {
    const sort = {};
    const filters = [{ index: { $in: level.features.map(f => f.index) } }];

    if (args.name) {
      const filter = resolveNameFilter(args.name);
      filters.push(filter);
    }

    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await FeatureModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
};

export default Level;
