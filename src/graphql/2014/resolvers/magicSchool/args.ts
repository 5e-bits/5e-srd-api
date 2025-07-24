import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum MagicSchoolOrderField {
  NAME = 'name'
}

export const MAGIC_SCHOOL_SORT_FIELD_MAP: Record<MagicSchoolOrderField, string> = {
  [MagicSchoolOrderField.NAME]: 'name'
}

registerEnumType(MagicSchoolOrderField, {
  name: 'MagicSchoolOrderField',
  description: 'Fields to sort Magic Schools by'
})

@InputType()
export class MagicSchoolOrder implements BaseOrderInterface<MagicSchoolOrderField> {
  @Field(() => MagicSchoolOrderField)
  by!: MagicSchoolOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => MagicSchoolOrder, { nullable: true })
  then_by?: MagicSchoolOrder
}

export const MagicSchoolOrderSchema: z.ZodType<MagicSchoolOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(MagicSchoolOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: MagicSchoolOrderSchema.optional()
  })
)

export const MagicSchoolArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  order: MagicSchoolOrderSchema.optional()
})

export const MagicSchoolIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class MagicSchoolArgs extends BaseFilterArgs {
  @Field(() => MagicSchoolOrder, {
    nullable: true,
    description: 'Specify sorting order for magic schools.'
  })
  order?: MagicSchoolOrder
}
