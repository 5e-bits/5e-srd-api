import ClassModel from '../../models/class';
import FeatureModel from '../../models/feature';
import SubclassModel from '../../models/subclass';
import { getMongoSortDirection } from './common';

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
