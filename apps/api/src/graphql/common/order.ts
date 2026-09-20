import { Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import { BaseOrderInterface } from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'

interface OrderOptions<K extends string, V extends string> {
  /** Prefix for the generated order input, e.g. `Spell` gives `SpellOrder`. */
  typeName: string
  /** Prefix for the order enum when it differs from `typeName`. */
  enumTypeName?: string
  description: string
  /** Enum key mapped to the exposed enum value and the database path it sorts on. */
  fields: Record<K, { value: V; path: string }>
}

/** Builds the sort enum, `then_by`-chained order input, zod schema and sort map for a resource. */
export function defineOrder<K extends string, const V extends string>({
  typeName,
  enumTypeName = typeName,
  description,
  fields
}: OrderOptions<K, V>) {
  const OrderField = {} as { [P in K]: V }
  const sortFieldMap: Record<string, string> = {}
  for (const key of Object.keys(fields) as K[]) {
    OrderField[key] = fields[key].value
    sortFieldMap[fields[key].value] = fields[key].path
  }
  registerEnumType(OrderField, { name: `${enumTypeName}OrderField`, description })

  @InputType(`${typeName}Order`)
  class Order implements BaseOrderInterface<V> {
    @Field(() => OrderField)
    by!: V

    @Field(() => OrderByDirection)
    direction!: OrderByDirection

    @Field(() => Order, { nullable: true })
    then_by?: Order
  }

  const OrderSchema: z.ZodType<Order> = z.lazy(() =>
    z.object({
      by: z.nativeEnum(OrderField),
      direction: z.nativeEnum(OrderByDirection),
      then_by: OrderSchema.optional()
    })
  )

  return { OrderField, Order, OrderSchema, sortFieldMap }
}
