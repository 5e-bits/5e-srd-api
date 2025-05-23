import { ArgsType } from 'type-graphql'
import { z } from 'zod'
import {
  BaseFilterArgs,
  BaseIndexArgsSchema,
  BasePaginationArgsSchema
} from '@/graphql/2014/common/args'
import { OrderByDirection } from '../../common/enums'

export const RuleArgsSchema = z
  .object({
    name: z.string().optional(),
    order_direction: z.nativeEnum(OrderByDirection).optional()
  })
  .merge(BasePaginationArgsSchema)

export const RuleIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class RuleArgs extends BaseFilterArgs {}
