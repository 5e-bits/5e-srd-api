import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root, Int } from 'type-graphql'
import { z } from 'zod'
import SubclassModel, { Subclass, SubclassSpell } from '@/models/2014/subclass'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import ClassModel, { Class } from '@/models/2014/class'
import { resolveSingleReference } from '@/graphql/2014rewrite/utils/resolvers'
import LevelModel, { Level } from '@/models/2014/level'
import { Feature } from '@/models/2014/feature'
import FeatureModel from '@/models/2014/feature'
import { SubclassSpellPrerequisiteUnion } from '@/graphql/2014rewrite/common/unions'
import { buildMongoSortQuery } from '@/graphql/2014rewrite/common/inputs'

const SubclassArgsSchema = z.object({
  name: z.string().optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

const SubclassIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class SubclassArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by subclass name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction for the name field (default: ASC)'
  })
  order_direction?: OrderByDirection

  @Field(() => Int, { nullable: true, description: 'TODO: Pass 5 - Number of results to skip' })
  skip?: number

  @Field(() => Int, {
    nullable: true,
    description: 'TODO: Pass 5 - Maximum number of results to return'
  })
  limit?: number
}

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

    // TODO: Pass 5 - Implement pagination
    // if (validatedArgs.skip) {
    //   query.skip(validatedArgs.skip)
    // }
    // if (validatedArgs.limit) {
    //  query.limit(validatedArgs.limit)
    // }

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
