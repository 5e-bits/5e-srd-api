import { ArgsType } from 'type-graphql'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const AlignmentArgsSchema = BaseFilterArgsSchema

export const AlignmentIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class AlignmentArgs extends BaseFilterArgs {}
