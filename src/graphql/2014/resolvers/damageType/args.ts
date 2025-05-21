import { ArgsType } from 'type-graphql'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const DamageTypeArgsSchema = BaseFilterArgsSchema

export const DamageTypeIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class DamageTypeArgs extends BaseFilterArgs {}
