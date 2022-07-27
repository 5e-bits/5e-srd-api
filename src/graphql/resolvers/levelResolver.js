import ClassModel from '../../models/class/index.js';
import FeatureModel from '../../models/feature/index.js';
import SubclassModel from '../../models/subclass/index.js';
import { getMongoSortDirection } from './common.js';

const Level = {
  class: async level => await ClassModel.findOne({ index: level.class.index }).lean(),
  subclass: async level =>
    level.subclass ? await SubclassModel.findOne({ index: level.subclass.index }).lean() : null,
  features: async (level, args) => {
    const sort = {};
    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await FeatureModel.find({ index: { $in: level.features.map(f => f.index) } })
      .sort(sort)
      .lean();
  },
};

export default Level;
