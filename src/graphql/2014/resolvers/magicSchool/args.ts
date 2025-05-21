import { ArgsType } from 'type-graphql'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const MagicSchoolArgsSchema = BaseFilterArgsSchema

export const MagicSchoolIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class MagicSchoolArgs extends BaseFilterArgs {}
