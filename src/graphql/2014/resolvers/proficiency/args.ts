import { ArgsType, Field, registerEnumType } from 'type-graphql'
import { z } from 'zod'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export enum ProficiencyOrderField {
  NAME = 'name',
  TYPE = 'type'
}

registerEnumType(ProficiencyOrderField, {
  name: 'ProficiencyOrderField',
  description: 'Fields to sort Proficiencies by'
})

export const PROFICIENCY_SORT_FIELD_MAP: Record<ProficiencyOrderField, string> = {
  [ProficiencyOrderField.NAME]: 'name',
  [ProficiencyOrderField.TYPE]: 'type'
}

export const ProficiencyArgsSchema = BaseFilterArgsSchema.extend({
  class: z.array(z.string()).optional(),
  race: z.array(z.string()).optional(),
  type: z.array(z.string()).optional(),
  order_by: z.nativeEnum(ProficiencyOrderField).optional()
})

export const ProficiencyIndexArgsSchema = BaseIndexArgsSchema

// Define ArgsType for the proficiencies query
@ArgsType()
export class ProficiencyArgs extends BaseFilterArgs {
  @Field(() => [String], {
    nullable: true,
    description: 'Filter by class index (e.g., ["barbarian", "bard"])'
  })
  class?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by race index (e.g., ["dragonborn", "dwarf"])'
  })
  race?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by proficiency type (exact match, e.g., ["ARMOR", "WEAPONS"])'
  })
  type?: string[]

  @Field(() => ProficiencyOrderField, {
    nullable: true,
    description: 'Field to sort proficiencies by.'
  })
  order_by?: ProficiencyOrderField
}
