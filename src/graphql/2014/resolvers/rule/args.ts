import { ArgsType } from 'type-graphql'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const RuleArgsSchema = BaseFilterArgsSchema

export const RuleIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class RuleArgs extends BaseFilterArgs {}
