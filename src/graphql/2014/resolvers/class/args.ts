import { ArgsType, Field, registerEnumType } from 'type-graphql'
import { z } from 'zod'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/2014/common/inputs'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export enum ClassOrderField {
  NAME = 'name',
  HIT_DIE = 'hit_die'
}

registerEnumType(ClassOrderField, {
  name: 'ClassOrderField',
  description: 'Fields to sort Classes by'
})

export const CLASS_SORT_FIELD_MAP: Record<ClassOrderField, string> = {
  [ClassOrderField.NAME]: 'name',
  [ClassOrderField.HIT_DIE]: 'hit_die'
}

export const ClassArgsSchema = BaseFilterArgsSchema.extend({
  hit_die: NumberFilterInputSchema.optional(),
  order_by: z.nativeEnum(ClassOrderField).optional()
})

export const ClassIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class ClassArgs extends BaseFilterArgs {
  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by hit die size. Allows exact match, list of values, or a range.'
  })
  hit_die?: NumberFilterInput

  @Field(() => ClassOrderField, {
    nullable: true,
    description: 'Field to sort classes by.'
  })
  order_by?: ClassOrderField
}
