import { ArgsType } from 'type-graphql'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const ConditionArgsSchema = BaseFilterArgsSchema

export const ConditionIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class ConditionArgs extends BaseFilterArgs {}
