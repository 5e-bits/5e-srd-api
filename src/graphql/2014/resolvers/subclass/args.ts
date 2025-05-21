import { ArgsType } from 'type-graphql'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const SubclassArgsSchema = BaseFilterArgsSchema

export const SubclassIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class SubclassArgs extends BaseFilterArgs {}
