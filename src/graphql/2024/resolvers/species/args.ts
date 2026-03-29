import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

export enum SpeciesOrderField {
  NAME = 'name'
}

export const SPECIES_SORT_FIELD_MAP: Record<SpeciesOrderField, string> = {
  [SpeciesOrderField.NAME]: 'name'
}

registerEnumType(SpeciesOrderField, {
  name: 'Species2024OrderField',
  description: 'Fields to sort Species by'
})

@InputType()
export class SpeciesOrder implements BaseOrderInterface<SpeciesOrderField> {
  @Field(() => SpeciesOrderField)
  by!: SpeciesOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => SpeciesOrder, { nullable: true })
  then_by?: SpeciesOrder
}

export const SpeciesOrderSchema: z.ZodType<SpeciesOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(SpeciesOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: SpeciesOrderSchema.optional()
  })
)

export const SpeciesArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  order: SpeciesOrderSchema.optional()
})

export const SpeciesIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class SpeciesArgs extends BaseFilterArgs {
  @Field(() => SpeciesOrder, {
    nullable: true,
    description: 'Specify sorting order for species.'
  })
  order?: SpeciesOrder
}
