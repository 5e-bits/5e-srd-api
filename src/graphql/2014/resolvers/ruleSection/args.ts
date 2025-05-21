import { ArgsType } from 'type-graphql'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const RuleSectionArgsSchema = BaseFilterArgsSchema

export const RuleSectionIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class RuleSectionArgs extends BaseFilterArgs {}
