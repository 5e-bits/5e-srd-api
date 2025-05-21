import { ArgsType } from 'type-graphql'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const TraitArgsSchema = BaseFilterArgsSchema

export const TraitIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class TraitArgs extends BaseFilterArgs {}
