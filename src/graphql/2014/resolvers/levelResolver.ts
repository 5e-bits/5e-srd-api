import ClassModel from '@/models/2014/class'
import FeatureModel from '@/models/2014/feature'
import SubclassModel from '@/models/2014/subclass'
import {
  coalesceFilters,
  getMongoSortDirection,
  QueryParams,
  resolveContainsStringFilter,
  SortQuery
} from './common'

import { Level } from '@/models/2014/level'
import { APIReference } from '@/models/2014/common'

const LevelResolver = {
  class: async (level: Level) => await ClassModel.findOne({ index: level.class.index }).lean(),
  subclass: async (level: Level) =>
    level.subclass ? await SubclassModel.findOne({ index: level.subclass.index }).lean() : null,
  features: async (level: Level, args: QueryParams) => {
    const filters: any[] = [{ index: { $in: level.features?.map((f: APIReference) => f.index) } }]

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name))
    }

    const sort: SortQuery = {}
    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction)
    }

    return await FeatureModel.find(coalesceFilters(filters)).sort(sort).lean()
  }
}

export default LevelResolver
