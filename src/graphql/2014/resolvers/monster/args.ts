import { ArgsType, Field, InputType, registerEnumType } from 'type-graphql'
import { z } from 'zod'

import {
  BaseFilterArgs,
  BaseFilterArgsSchema,
  BaseIndexArgsSchema,
  BaseOrderInterface
} from '@/graphql/common/args'
import { OrderByDirection } from '@/graphql/common/enums'
import { NumberFilterInput, NumberFilterInputSchema } from '@/graphql/common/inputs'

export enum MonsterOrderField {
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

export const MONSTER_SORT_FIELD_MAP: Record<MonsterOrderField, string> = {
  [MonsterOrderField.NAME]: 'name',
  [MonsterOrderField.TYPE]: 'type',
  [MonsterOrderField.SIZE]: 'size',
  [MonsterOrderField.CHALLENGE_RATING]: 'challenge_rating',
  [MonsterOrderField.STRENGTH]: 'strength',
  [MonsterOrderField.DEXTERITY]: 'dexterity',
  [MonsterOrderField.CONSTITUTION]: 'constitution',
  [MonsterOrderField.INTELLIGENCE]: 'intelligence',
  [MonsterOrderField.WISDOM]: 'wisdom',
  [MonsterOrderField.CHARISMA]: 'charisma'
}

registerEnumType(MonsterOrderField, {
  name: 'MonsterOrderField',
  description: 'Fields to sort Monsters by'
})

@InputType()
export class MonsterOrder implements BaseOrderInterface<MonsterOrderField> {
  @Field(() => MonsterOrderField)
  by!: MonsterOrderField

  @Field(() => OrderByDirection)
  direction!: OrderByDirection

  @Field(() => MonsterOrder, { nullable: true })
  then_by?: MonsterOrder
}

export const MonsterOrderSchema: z.ZodType<MonsterOrder> = z.lazy(() =>
  z.object({
    by: z.nativeEnum(MonsterOrderField),
    direction: z.nativeEnum(OrderByDirection),
    then_by: MonsterOrderSchema.optional()
  })
)

export const MonsterArgsSchema = z.object({
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
  order: MonsterOrderSchema.optional()
})

export const MonsterIndexArgsSchema = BaseIndexArgsSchema

@ArgsType()
export class MonsterArgs extends BaseFilterArgs {
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

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by challenge rating'
  })
  challenge_rating?: NumberFilterInput

  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster size (exact match, e.g., "Medium")'
  })
  size?: string

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by monster XP'
  })
  xp?: NumberFilterInput

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by strength score'
  })
  strength?: NumberFilterInput

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by dexterity score'
  })
  dexterity?: NumberFilterInput

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by constitution score'
  })
  constitution?: NumberFilterInput

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by intelligence score'
  })
  intelligence?: NumberFilterInput

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by wisdom score'
  })
  wisdom?: NumberFilterInput

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by charisma score'
  })
  charisma?: NumberFilterInput

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by damage vulnerability indices'
  })
  damage_vulnerabilities?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by damage resistance indices'
  })
  damage_resistances?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by damage immunity indices'
  })
  damage_immunities?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by condition immunity indices'
  })
  condition_immunities?: string[]

  @Field(() => MonsterOrder, {
    nullable: true,
    description: 'Specify sorting order for monsters.'
  })
  order?: MonsterOrder
}
