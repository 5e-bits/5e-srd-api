import { ArgsType } from 'type-graphql'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export const EquipmentCategoryArgsSchema = BaseFilterArgsSchema

export const EquipmentCategoryIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class EquipmentCategoryArgs extends BaseFilterArgs {}
