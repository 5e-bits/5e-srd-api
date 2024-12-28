import ClassModel from '../../../models/2014/class/index.js';
import FeatureModel from '../../../models/2014/feature/index.js';
import SubclassModel from '../../../models/2014/subclass/index.js';
import {
  coalesceFilters,
  getMongoSortDirection,
  QueryParams,
  resolveContainsStringFilter,
  SortQuery,
} from './common.js';

import { Level } from '../../../models/2014/level/types.js';

const Level = {
  class: async (level: Level) => await ClassModel.findOne({ index: level.class.index }).lean(),
  subclass: async (level: Level) =>
    level.subclass ? await SubclassModel.findOne({ index: level.subclass.index }).lean() : null,
  features: async (level: Level, args: QueryParams) => {
    const filters: any[] = [{ index: { $in: level.features?.map((f) => f.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    const sort: SortQuery = {};
    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await FeatureModel.find(coalesceFilters(filters)).sort(sort).lean();
  },
};

export default Level;
