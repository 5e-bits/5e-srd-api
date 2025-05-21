import { ArgsType } from 'type-graphql'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const FeatArgsSchema = BaseFilterArgsSchema

export const FeatIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class FeatArgs extends BaseFilterArgs {}
