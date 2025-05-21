import { ArgsType, Field, registerEnumType } from 'type-graphql'
import { z } from 'zod'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export enum SkillOrderField {
  NAME = 'name',
  ABILITY_SCORE = 'ability_score'
}

registerEnumType(SkillOrderField, {
  name: 'SkillOrderField',
  description: 'Fields to sort Skills by'
})

export const SKILL_SORT_FIELD_MAP: Record<SkillOrderField, string> = {
  [SkillOrderField.NAME]: 'name',
  [SkillOrderField.ABILITY_SCORE]: 'ability_score.name'
}

export const SkillArgsSchema = BaseFilterArgsSchema.extend({
  ability_score: z.array(z.string()).optional(),
  order_by: z.nativeEnum(SkillOrderField).optional().default(SkillOrderField.NAME)
})

export const SkillIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class SkillArgs extends BaseFilterArgs {
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
