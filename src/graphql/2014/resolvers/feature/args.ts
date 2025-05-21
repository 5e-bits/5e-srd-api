import { ArgsType, Field, registerEnumType } from 'type-graphql'
import { z } from 'zod'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/2014/common/inputs'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export enum FeatureOrderField {
  NAME = 'name',
  LEVEL = 'level',
  CLASS = 'class',
  SUBCLASS = 'subclass'
}

registerEnumType(FeatureOrderField, {
  name: 'FeatureOrderField',
  description: 'Fields to sort Features by'
})

export const FEATURE_SORT_FIELD_MAP: Record<FeatureOrderField, string> = {
  [FeatureOrderField.NAME]: 'name',
  [FeatureOrderField.LEVEL]: 'level',
  [FeatureOrderField.CLASS]: 'class.name',
  [FeatureOrderField.SUBCLASS]: 'subclass.name'
}

export const FeatureArgsSchema = BaseFilterArgsSchema.extend({
  level: NumberFilterInputSchema.optional(),
  class: z.array(z.string()).optional(),
  subclass: z.array(z.string()).optional(),
  order_by: z.nativeEnum(FeatureOrderField).optional()
})

export const FeatureIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class FeatureArgs extends BaseFilterArgs {
  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by level. Allows exact match, list, or range.'
  })
  level?: NumberFilterInput

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more associated class indices'
  })
  class?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more associated subclass indices'
  })
  subclass?: string[]

  @Field(() => FeatureOrderField, {
    nullable: true,
    description: 'Field to sort features by (e.g., NAME, LEVEL, CLASS, SUBCLASS).'
  })
  order_by?: FeatureOrderField
}
