import ClassModel from '../../models/class/index.js';
import FeatureModel from '../../models/feature/index.js';
import SubclassModel from '../../models/subclass/index.js';
import {
  coalesceFilters,
  getMongoSortDirection,
  resolveContainsStringFilter,
  SortDirection,
  QueryParams,
} from './common.js';

import { Level } from '../../models/level/types';

type Sort = {
  name?: 1 | -1;
};

const Level = {
  class: async (level: Level) => await ClassModel.findOne({ index: level.class.index }).lean(),
  subclass: async (level: Level) =>
    level.subclass ? await SubclassModel.findOne({ index: level.subclass.index }).lean() : null,
  features: async (level: Level, args: QueryParams) => {
    const sort: Sort = {};
    const filters: any[] = [{ index: { $in: level.features?.map(f => f.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
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
