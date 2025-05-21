import { ArgsType } from 'type-graphql'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const WeaponPropertyArgsSchema = BaseFilterArgsSchema

export const WeaponPropertyIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class WeaponPropertyArgs extends BaseFilterArgs {}
