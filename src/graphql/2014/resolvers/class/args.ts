import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/common/inputs'

export enum ClassOrderField {
  NAME = 'name',
  HIT_DIE = 'hit_die'
}

export const CLASS_SORT_FIELD_MAP: Record<ClassOrderField, string> = {
  [ClassOrderField.NAME]: 'name',
  [ClassOrderField.HIT_DIE]: 'hit_die'
}

registerEnumType(ClassOrderField, {
  name: 'ClassOrderField',
  description: 'Fields to sort Classes by'
})

@InputType()
export class ClassOrder implements BaseOrderInterface<ClassOrderField> {
  @Field(() => ClassOrderField)
  by!: ClassOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => ClassOrder, { nullable: true })
  then_by?: ClassOrder
}

export const ClassOrderSchema: z.ZodType<ClassOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(ClassOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: ClassOrderSchema.optional()
  })
)

export const ClassArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  hit_die: NumberFilterInputSchema.optional(),
  order: ClassOrderSchema.optional()
})

export const ClassIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class ClassArgs extends BaseFilterArgs {
  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by hit die size. Allows exact match, list of values, or a range.'
  })
  hit_die?: NumberFilterInput

  @Field(() => ClassOrder, {
    nullable: true,
    description: 'Specify sorting order for classes. Allows nested sorting.'
  })
  order?: ClassOrder
}
