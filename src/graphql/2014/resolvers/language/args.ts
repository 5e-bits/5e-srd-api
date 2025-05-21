import { ArgsType, Field, registerEnumType } from 'type-graphql'
import { z } from 'zod'
import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema
} from '@/graphql/2014/common/args'

export enum LanguageOrderField {
  NAME = 'name',
  TYPE = 'type',
  SCRIPT = 'script'
}

registerEnumType(LanguageOrderField, {
  name: 'LanguageOrderField',
  description: 'Fields to sort Languages by'
})

export const LANGUAGE_SORT_FIELD_MAP: Record<LanguageOrderField, string> = {
  [LanguageOrderField.NAME]: 'name',
  [LanguageOrderField.TYPE]: 'type',
  [LanguageOrderField.SCRIPT]: 'script'
}

export const LanguageArgsSchema = BaseFilterArgsSchema.extend({
  type: z
    .string()
    .optional()
    .transform((val) => {
      if (typeof val === 'string' && val.length > 0) {
        return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
      }
      return undefined
    }),
  script: z.array(z.string()).optional(),
  order_by: z.nativeEnum(LanguageOrderField).optional()
})

export const LanguageIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class LanguageArgs extends BaseFilterArgs {
  @Field(() => String, {
    nullable: true,
    description:
      'Filter by language type (e.g., Standard, Exotic) - case-insensitive exact match after normalization'
  })
  type?: string

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more language scripts (e.g., ["Common", "Elvish"])'
  })
  script?: string[]

  @Field(() => LanguageOrderField, {
    nullable: true,
    description: 'Field to sort languages by.'
  })
  order_by?: LanguageOrderField
}
