import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum ProficiencyOrderField {
  NAME = 'name',
  TYPE = 'type'
}

export const PROFICIENCY_SORT_FIELD_MAP: Record<ProficiencyOrderField, string> = {
  [ProficiencyOrderField.NAME]: 'name',
  [ProficiencyOrderField.TYPE]: 'type'
}

registerEnumType(ProficiencyOrderField, {
  name: 'ProficiencyOrderField',
  description: 'Fields to sort Proficiencies by'
})

@InputType()
export class ProficiencyOrder implements BaseOrderInterface<ProficiencyOrderField> {
  @Field(() => ProficiencyOrderField)
  by!: ProficiencyOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => ProficiencyOrder, { nullable: true })
  then_by?: ProficiencyOrder
}

export const ProficiencyOrderSchema: z.ZodType<ProficiencyOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(ProficiencyOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: ProficiencyOrderSchema.optional()
  })
)

export const ProficiencyArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  class: z.array(z.string()).optional(),
  race: z.array(z.string()).optional(),
  type: z.array(z.string()).optional(),
  order: ProficiencyOrderSchema.optional()
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

  @Field(() => ProficiencyOrder, {
    nullable: true,
    description: 'Specify sorting order for proficiencies. Allows nested sorting.'
  })
  order?: ProficiencyOrder
}
