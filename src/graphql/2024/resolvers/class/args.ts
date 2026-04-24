import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgs,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum ClassOrderField {
  NAME = 'name'
}

export const CLASS_SORT_FIELD_MAP: Record<ClassOrderField, string> = {
  [ClassOrderField.NAME]: 'name'
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
  order: ClassOrderSchema.optional()
})

export const ClassIndexArgsSchema = BaseIndexArgsSchema
export { BaseIndexArgs as ClassIndexArgs }

@ArgsType()
export class ClassArgs extends BaseFilterArgs {
  @Field(() => ClassOrder, {
    nullable: true,
    description: 'Specify sorting order for classes.'
  })
  order?: ClassOrder
}
