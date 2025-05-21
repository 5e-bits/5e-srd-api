import { ArgsType } from 'type-graphql'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const SubraceArgsSchema = BaseFilterArgsSchema

export const SubraceIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class SubraceArgs extends BaseFilterArgs {}
