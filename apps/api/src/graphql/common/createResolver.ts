import { ReturnModelType } from '@typegoose/typegoose'
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types'
import { Args, ArgsType, Field, Query, Resolver } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgs,
  BaseIndexArgsSchema,
  BaseOrderInterface,
  buildSortPipeline
} from '@/graphql/common/args'
import { Filter, regexFilter } from '@/graphql/common/filters'
import { defineOrder } from '@/graphql/common/order'

interface ResolverOptions<T extends object, S extends z.ZodObject<any>> {
  Type: object
  Model: ReturnModelType<AnyParamConstructor<T>>
  singular: string
  plural: string
  /** Prefix for the generated order input, e.g. `DamageType` gives `DamageTypeOrder`. */
  typeName: string
  /** Prefix for the order enum when it differs from `typeName`. */
  enumTypeName?: string
  descriptions: { fields: string; order: string; list: string; single: string }
  /** Enum key mapped to its exposed value and database sort path. Defaults to name only. */
  orderFields?: Record<string, { value: string; path: string }>
  /** Enum key to sort by when no `order` arg is given, or false for none. Defaults to `NAME`. */
  defaultSort?: string | false
  /** Extra filter arguments (extending `BaseFilterArgs`) and their zod schema, without `order`. */
  Args?: new () => object
  argsSchema?: S
  /** Conditions for the list query. Defaults to filtering by `name`. */
  filters?: (args: z.output<S>) => Filter[]
}

/**
 * Builds an abstract resolver base with the list and single-by-index queries and the order
 * input for a resource. Extend it to add field resolvers.
 */
export function createResolver<
  T extends object,
  S extends z.ZodObject<any> = typeof BaseFilterArgsSchema
>({
  Type,
  Model,
  singular,
  plural,
  typeName,
  enumTypeName,
  descriptions,
  orderFields = { NAME: { value: 'name', path: 'name' } },
  defaultSort = 'NAME',
  Args: FilterArgs = BaseFilterArgs,
  argsSchema = BaseFilterArgsSchema as unknown as S,
  filters = (args: { name?: string }) => [regexFilter('name', args.name)]
}: ResolverOptions<T, S>) {
  const { OrderField, Order, OrderSchema, sortFieldMap } = defineOrder({
    typeName,
    enumTypeName,
    description: descriptions.fields,
    fields: orderFields
  })

  @ArgsType()
  class ListArgs extends (FilterArgs as new () => object) {
    @Field(() => Order, { nullable: true, description: descriptions.order })
    order?: InstanceType<typeof Order>
  }
  const ListArgsSchema = argsSchema.extend({ order: OrderSchema.optional() })

  @Resolver()
  abstract class BaseResolver {
    @Query(() => [Type], { name: plural, description: descriptions.list })
    async list(@Args(() => ListArgs) args: ListArgs): Promise<T[]> {
      const validatedArgs = ListArgsSchema.parse(args) as z.output<S> & {
        skip?: number
        limit?: number
        order?: BaseOrderInterface<string>
      }
      const query = Model.find()

      const conditions = filters(validatedArgs).filter((f) => f !== undefined)
      if (conditions.length > 0) {
        query.where({ $and: conditions })
      }

      const sortQuery = buildSortPipeline<string>({
        order: validatedArgs.order,
        sortFieldMap,
        defaultSortField: defaultSort === false ? undefined : OrderField[defaultSort]
      })
      if (Object.keys(sortQuery).length > 0) {
        query.sort(sortQuery)
      }

      if (validatedArgs.skip !== undefined) {
        query.skip(validatedArgs.skip)
      }
      if (validatedArgs.limit !== undefined) {
        query.limit(validatedArgs.limit)
      }

      return query.lean() as unknown as Promise<T[]>
    }

    @Query(() => Type, { name: singular, nullable: true, description: descriptions.single })
    async single(@Args(() => BaseIndexArgs) args: BaseIndexArgs): Promise<T | null> {
      const { index } = BaseIndexArgsSchema.parse(args)
      return Model.findOne({ index }).lean() as unknown as Promise<T | null>
    }
  }

  return BaseResolver
}
