import { Resolver, Query, Arg, Args, ArgsType, Field, Int, FieldResolver, Root } from 'type-graphql'
import { IsOptional, IsString, IsEnum, IsIn } from 'class-validator'
import MonsterModel, { Monster } from '@/models/2014/monster'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import { APIReference } from '@/models/2014/common'
import ConditionModel, { Condition } from '@/models/2014/condition'
import { resolveMultipleReferences } from '../utils/resolvers'

@ArgsType()
class MonsterArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster type (case-insensitive, exact match)'
  })
  @IsOptional()
  @IsString()
  type?: string

  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster subtype (case-insensitive, exact match)'
  })
  @IsOptional()
  @IsString()
  subtype?: string

  @Field(() => [Int], {
    nullable: true,
    description: 'Filter by challenge rating values'
  })
  @IsOptional()
  @IsIn(
    [
      0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30
    ],
    { each: true }
  )
  challenge_rating?: number[]

  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster size (case-insensitive, exact match)'
  })
  @IsOptional()
  @IsString()
  size?: string

  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster alignment (case-insensitive, exact match)'
  })
  @IsOptional()
  @IsString()
  alignment?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the name field (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(Monster)
export class MonsterResolver {
  @Query(() => [Monster], {
    description:
      'Gets all monsters, optionally filtering by name, type, or challenge rating and sorted by name.'
  })
  async monsters(
    @Args() { name, type, subtype, challenge_rating, size, alignment, order_direction }: MonsterArgs
  ): Promise<Monster[]> {
    const query = MonsterModel.find()
    const filters: any = {}

    if (name) {
      filters.name = { $regex: new RegExp(escapeRegExp(name), 'i') }
    }

    if (type) {
      filters.type = { $regex: new RegExp(`^${escapeRegExp(type)}$`, 'i') }
    }

    if (subtype) {
      filters.subtype = { $regex: new RegExp(`^${escapeRegExp(subtype)}$`, 'i') }
    }

    if (challenge_rating && challenge_rating.length > 0) {
      filters.challenge_rating = { $in: challenge_rating }
    }

    if (size) {
      filters.size = { $regex: new RegExp(`^${escapeRegExp(size)}$`, 'i') }
    }

    if (alignment) {
      filters.alignment = { $regex: new RegExp(`^${escapeRegExp(alignment)}$`, 'i') }
    }

    if (Object.keys(filters).length > 0) {
      query.where(filters)
    }

    if (order_direction) {
      const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
      query.sort({ name: sortOrder })
    }

    return query.lean()
  }

  @Query(() => Monster, { nullable: true, description: 'Gets a single monster by its index.' })
  async monster(@Arg('index', () => String) index: string): Promise<Monster | null> {
    return MonsterModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [Condition])
  async condition_immunities(@Root() monster: Monster): Promise<APIReference[]> {
    return resolveMultipleReferences(monster.condition_immunities, ConditionModel)
  }

  @FieldResolver(() => [Monster])
  async forms(@Root() monster: Monster): Promise<APIReference[] | null> {
    if (!monster.forms) return null // Guard clause for optional field
    return resolveMultipleReferences(monster.forms, MonsterModel) // Reference Monster model itself
  }

  // Actions, armor_class, legendary_actions, proficiencies, reactions, special_abilities are deferred to Intermediate Step
}

// Nested resolvers removed for now. They will be added back in the Intermediate Step
// when the complex types (ArmorClass, nested Proficiency, SpecialAbilitySpellcasting etc.)
// are fully defined and exposed in monster.ts

/*
@Resolver(ArmorClassArmor)
export class ArmorClassArmorResolver { ... }

@Resolver(ArmorClassSpell)
export class ArmorClassSpellResolver { ... }

@Resolver(ArmorClassCondition)
export class ArmorClassConditionResolver { ... }

@Resolver(MonsterNestedProficiency)
export class MonsterProficiencyResolver { ... }

@Resolver(SpecialAbilitySpellcasting)
export class SpecialAbilitySpellcastingResolver { ... }
*/
