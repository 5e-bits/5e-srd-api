import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import SubclassModel, { Subclass, SubclassSpell } from '@/models/2014/subclass'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import ClassModel, { Class } from '@/models/2014/class'
import { resolveSingleReference } from '@/graphql/2014rewrite/utils/resolvers'
import LevelModel, { Level } from '@/models/2014/level'
import { Feature } from '@/models/2014/feature'
import FeatureModel from '@/models/2014/feature'
import { SubclassSpellPrerequisiteUnion } from '@/graphql/2014rewrite/common/unions'

@ArgsType()
class SubclassArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by subclass name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the name field (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(Subclass)
export class SubclassResolver {
  @Query(() => [Subclass], {
    description: 'Gets all subclasses, optionally filtered by name and sorted.'
  })
  async subclasses(@Args() { name, order_direction }: SubclassArgs): Promise<Subclass[]> {
    const query = SubclassModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => Subclass, { nullable: true, description: 'Gets a single subclass by its index.' })
  async subclass(@Arg('index', () => String) index: string): Promise<Subclass | null> {
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
