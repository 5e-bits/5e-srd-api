import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgs,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/common/inputs'

export enum Monster2024OrderField {
  NAME = 'name',
  TYPE = 'type',
  SIZE = 'size',
  CHALLENGE_RATING = 'challenge_rating',
  STRENGTH = 'strength',
  DEXTERITY = 'dexterity',
  CONSTITUTION = 'constitution',
  INTELLIGENCE = 'intelligence',
  WISDOM = 'wisdom',
  CHARISMA = 'charisma'
}

export const MONSTER2024_SORT_FIELD_MAP: Record<Monster2024OrderField, string> = {
  [Monster2024OrderField.NAME]: 'name',
  [Monster2024OrderField.TYPE]: 'type',
  [Monster2024OrderField.SIZE]: 'size',
  [Monster2024OrderField.CHALLENGE_RATING]: 'challenge_rating',
  [Monster2024OrderField.STRENGTH]: 'strength',
  [Monster2024OrderField.DEXTERITY]: 'dexterity',
  [Monster2024OrderField.CONSTITUTION]: 'constitution',
  [Monster2024OrderField.INTELLIGENCE]: 'intelligence',
  [Monster2024OrderField.WISDOM]: 'wisdom',
  [Monster2024OrderField.CHARISMA]: 'charisma'
}

registerEnumType(Monster2024OrderField, {
  name: 'Monster2024OrderField',
  description: 'Fields to sort 2024 Monsters by'
})

@InputType()
export class Monster2024Order implements BaseOrderInterface<Monster2024OrderField> {
  @Field(() => Monster2024OrderField)
  by!: Monster2024OrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => Monster2024Order, { nullable: true })
  then_by?: Monster2024Order
}

export const Monster2024OrderSchema: z.ZodType<Monster2024Order> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(Monster2024OrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: Monster2024OrderSchema.optional()
  })
)

export const Monster2024ArgsSchema = z.object({
  ...BaseFilterArgsSchema.shape,
  type: z.string().optional(),
  subtype: z.string().optional(),
  challenge_rating: NumberFilterInputSchema.optional(),
  size: z.string().optional(),
  xp: NumberFilterInputSchema.optional(),
  strength: NumberFilterInputSchema.optional(),
  dexterity: NumberFilterInputSchema.optional(),
  constitution: NumberFilterInputSchema.optional(),
  intelligence: NumberFilterInputSchema.optional(),
  wisdom: NumberFilterInputSchema.optional(),
  charisma: NumberFilterInputSchema.optional(),
  damage_vulnerabilities: z.array(z.string()).optional(),
  damage_resistances: z.array(z.string()).optional(),
  damage_immunities: z.array(z.string()).optional(),
  condition_immunities: z.array(z.string()).optional(),
  order: Monster2024OrderSchema.optional()
})

export const Monster2024IndexArgsSchema = BaseIndexArgsSchema
export { BaseIndexArgs as Monster2024IndexArgs }

@ArgsType()
export class Monster2024Args extends BaseFilterArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster type (case-insensitive, exact match, e.g., "beast")'
  })
  type?: string

  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster subtype (case-insensitive, exact match, e.g., "goblinoid")'
  })
  subtype?: string

  @Field(() => NumberFilterInput, { nullable: true, description: 'Filter by challenge rating' })
  challenge_rating?: NumberFilterInput

  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster size (exact match, e.g., "Medium")'
  })
  size?: string

  @Field(() => NumberFilterInput, { nullable: true, description: 'Filter by monster XP' })
  xp?: NumberFilterInput

  @Field(() => NumberFilterInput, { nullable: true, description: 'Filter by strength score' })
  strength?: NumberFilterInput

  @Field(() => NumberFilterInput, { nullable: true, description: 'Filter by dexterity score' })
  dexterity?: NumberFilterInput

  @Field(() => NumberFilterInput, { nullable: true, description: 'Filter by constitution score' })
  constitution?: NumberFilterInput

  @Field(() => NumberFilterInput, { nullable: true, description: 'Filter by intelligence score' })
  intelligence?: NumberFilterInput

  @Field(() => NumberFilterInput, { nullable: true, description: 'Filter by wisdom score' })
  wisdom?: NumberFilterInput

  @Field(() => NumberFilterInput, { nullable: true, description: 'Filter by charisma score' })
  charisma?: NumberFilterInput

  @Field(() => [String], { nullable: true, description: 'Filter by damage vulnerability indices' })
  damage_vulnerabilities?: string[]

  @Field(() => [String], { nullable: true, description: 'Filter by damage resistance indices' })
  damage_resistances?: string[]

  @Field(() => [String], { nullable: true, description: 'Filter by damage immunity indices' })
  damage_immunities?: string[]

  @Field(() => [String], { nullable: true, description: 'Filter by condition immunity indices' })
  condition_immunities?: string[]

  @Field(() => Monster2024Order, {
    nullable: true,
    description: 'Specify sorting order for monsters.'
  })
  order?: Monster2024Order
}
