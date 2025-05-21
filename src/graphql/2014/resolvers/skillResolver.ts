import {
  Resolver,
  Query,
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Root,
  registerEnumType
} from 'type-graphql'
import { z } from 'zod'
import SkillModel, { Skill } from '@/models/2014/skill'
import { escapeRegExp } from '@/util'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import { resolveSingleReference } from '@/graphql/2014/utils/resolvers'
import { buildMongoSortQuery } from '@/graphql/2014/common/inputs'
import { BaseFilterArgs, BaseFilterArgsSchema } from '../common/args'

export enum SkillOrderField {
  NAME = 'name',
  ABILITY_SCORE = 'ability_score'
}

registerEnumType(SkillOrderField, {
  name: 'SkillOrderField',
  description: 'Fields to sort Skills by'
})

const SKILL_SORT_FIELD_MAP: Record<SkillOrderField, string> = {
  [SkillOrderField.NAME]: 'name',
  [SkillOrderField.ABILITY_SCORE]: 'ability_score.name'
}

const SkillArgsSchema = BaseFilterArgsSchema.extend({
  ability_score: z.array(z.string()).optional(),
  order_by: z.nativeEnum(SkillOrderField).optional().default(SkillOrderField.NAME)
})

const SkillIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class SkillArgs extends BaseFilterArgs {
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

    if (validatedArgs.skip !== undefined) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit !== undefined) {
      query.limit(validatedArgs.limit)
    }

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
