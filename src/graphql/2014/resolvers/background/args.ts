import { ArgsType } from 'type-graphql'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const BackgroundArgsSchema = BaseFilterArgsSchema

export const BackgroundIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class BackgroundArgs extends BaseFilterArgs {}
