import { Resolver, Query, Arg, Args, ArgsType, FieldResolver, Root } from 'type-graphql'
import { z } from 'zod'
import SubclassModel, { Subclass, SubclassSpell } from '@/models/2014/subclass'
import { escapeRegExp } from '@/util'
import ClassModel, { Class } from '@/models/2014/class'
import { resolveSingleReference } from '@/graphql/2014/utils/resolvers'
import LevelModel, { Level } from '@/models/2014/level'
import { Feature } from '@/models/2014/feature'
import FeatureModel from '@/models/2014/feature'
import { SubclassSpellPrerequisiteUnion } from '@/graphql/2014/common/unions'
import { buildMongoSortQuery } from '@/graphql/2014/common/inputs'
import { BaseFilterArgs, BaseFilterArgsSchema } from '../common/args'

const SubclassArgsSchema = BaseFilterArgsSchema

const SubclassIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class SubclassArgs extends BaseFilterArgs {}

@Resolver(Subclass)
export class SubclassResolver {
  @Query(() => [Subclass], {
    description: 'Gets all subclasses, optionally filtered by name and sorted.'
  })
  async subclasses(@Args() args: SubclassArgs): Promise<Subclass[]> {
    const validatedArgs = SubclassArgsSchema.parse(args)

    const query = SubclassModel.find()

    if (validatedArgs.name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildMongoSortQuery({
      orderDirection: validatedArgs.order_direction,
      defaultSortField: 'name'
    })

    if (sortQuery) {
      query.sort(sortQuery)
    }

    if (validatedArgs.skip) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => Subclass, { nullable: true, description: 'Gets a single subclass by its index.' })
  async subclass(@Arg('index') indexInput: string): Promise<Subclass | null> {
    const { index } = SubclassIndexArgsSchema.parse({ index: indexInput })
    return SubclassModel.findOne({ index }).lean()
  }

  @FieldResolver(() => Class, { nullable: true })
  async class(@Root() subclass: Subclass): Promise<Class | null> {
    return resolveSingleReference(subclass.class, ClassModel)
  }

  @FieldResolver(() => [Level], { nullable: true })
  async subclass_levels(@Root() subclass: Subclass): Promise<Level[]> {
    if (!subclass.index) return []

    return LevelModel.find({ 'subclass.index': subclass.index }).sort({ level: 1 })
  }
}

@Resolver(SubclassSpell)
export class SubclassSpellResolver {
  @FieldResolver(() => [SubclassSpellPrerequisiteUnion], {
    description: 'Resolves the prerequisites to actual Level or Feature objects.',
    nullable: true
  })
  async prerequisites(
    @Root() subclassSpell: SubclassSpell
  ): Promise<Array<Level | Feature> | null> {
    const prereqsData = subclassSpell.prerequisites

    if (!prereqsData || prereqsData.length === 0) {
      return null
    }

    const resolvedPrereqs: Array<Level | Feature> = []

    for (const prereq of prereqsData) {
      if (prereq.type === 'level') {
        const level = await LevelModel.findOne({ index: prereq.index }).lean()
        if (level) {
          resolvedPrereqs.push(level)
        }
      } else if (prereq.type === 'feature') {
        const feature = await FeatureModel.findOne({ index: prereq.index }).lean()
        if (feature) {
          resolvedPrereqs.push(feature)
        }
      }
    }

    return resolvedPrereqs.length > 0 ? resolvedPrereqs : null
  }
}
