import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root, Int } from 'type-graphql'
import { z } from 'zod'
import SkillModel, { Skill } from '@/models/2014/skill'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import { resolveSingleReference } from '@/graphql/2014rewrite/utils/resolvers'
import { buildMongoSortQuery } from '@/graphql/2014rewrite/common/inputs'

// Enum for Skill sortable fields
export enum SkillOrderField {
  NAME = 'name',
  ABILITY_SCORE = 'ability_score'
}

// Map GraphQL SkillOrderField to MongoDB field name
const SKILL_SORT_FIELD_MAP: Record<SkillOrderField, string> = {
  [SkillOrderField.NAME]: 'name',
  [SkillOrderField.ABILITY_SCORE]: 'ability_score.name'
}

const SkillArgsSchema = z.object({
  name: z.string().optional(),
  ability_score: z.array(z.string()).optional(),
  order_by: z.nativeEnum(SkillOrderField).optional().default(SkillOrderField.NAME),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

const SkillIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class SkillArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by skill name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by ability score index (e.g., ["str", "dex"])'
  })
  ability_score?: string[]

  @Field(() => SkillOrderField, {
    nullable: true,
    description: 'Field to sort by (default: name)',
    defaultValue: SkillOrderField.NAME
  })
  order_by?: SkillOrderField

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

@Resolver(Skill)
export class SkillResolver {
  @Query(() => [Skill], {
    description: 'Gets all skills, optionally filtered by name and sorted by name.'
  })
  async skills(@Args() args: SkillArgs): Promise<Skill[]> {
    const validatedArgs = SkillArgsSchema.parse(args)

    const query = SkillModel.find()
    const filters: any[] = []

    if (validatedArgs.name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.ability_score && validatedArgs.ability_score.length > 0) {
      filters.push({ 'ability_score.index': { $in: validatedArgs.ability_score } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildMongoSortQuery<SkillOrderField>({
      orderBy: validatedArgs.order_by,
      orderDirection: validatedArgs.order_direction,
      sortFieldMap: SKILL_SORT_FIELD_MAP,
      defaultSortField: SkillOrderField.NAME
    })
    if (sortQuery) {
      query.sort(sortQuery)
    }

    // TODO: Pass 5 - Implement pagination
    // if (skip) {
    //   query.skip(skip)
    // }
    // if (limit) {
    //   query.limit(limit)
    // }

    return query.lean()
  }

  @Query(() => Skill, { nullable: true, description: 'Gets a single skill by index.' })
  async skill(@Arg('index') indexInput: string): Promise<Skill | null> {
    const { index } = SkillIndexArgsSchema.parse({ index: indexInput })
    return SkillModel.findOne({ index }).lean()
  }

  @FieldResolver(() => AbilityScore)
  async ability_score(@Root() skill: Skill): Promise<AbilityScore | null> {
    return resolveSingleReference(skill.ability_score, AbilityScoreModel)
  }
}
