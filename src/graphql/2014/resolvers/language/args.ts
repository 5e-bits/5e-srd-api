import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum LanguageOrderField {
  NAME = 'name',
  TYPE = 'type',
  SCRIPT = 'script'
}

export const LANGUAGE_SORT_FIELD_MAP: Record<LanguageOrderField, string> = {
  [LanguageOrderField.NAME]: 'name',
  [LanguageOrderField.TYPE]: 'type',
  [LanguageOrderField.SCRIPT]: 'script'
}

registerEnumType(LanguageOrderField, {
  name: 'LanguageOrderField',
  description: 'Fields to sort Languages by'
})

@InputType()
export class LanguageOrder implements BaseOrderInterface<LanguageOrderField> {
  @Field(() => LanguageOrderField)
  by!: LanguageOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => LanguageOrder, { nullable: true })
  then_by?: LanguageOrder
}

export const LanguageOrderSchema: z.ZodType<LanguageOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(LanguageOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: LanguageOrderSchema.optional()
  })
)

export const LanguageArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  type: z.string().optional(),
  script: z.array(z.string()).optional(),
  order: LanguageOrderSchema.optional()
})

export const LanguageIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class LanguageArgs extends BaseFilterArgs {
  @Field(() => String, {
    nullable: true,
    description:
      'Filter by language type (e.g., Standard, Exotic) - case-insensitive exact match after normalization'
  })
  type?: string

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more language scripts (e.g., ["Common", "Elvish"])'
  })
  script?: string[]

  @Field(() => LanguageOrder, {
    nullable: true,
    description: 'Specify sorting order for languages.'
  })
  order?: LanguageOrder
}
