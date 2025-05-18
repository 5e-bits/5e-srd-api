import {
  Resolver,
  Query,
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Root,
  registerEnumType,
  Int
} from 'type-graphql'
import { z } from 'zod'
import MonsterModel, {
  Monster,
  ArmorClassArmor,
  ArmorClassSpell,
  ArmorClassCondition,
  MonsterProficiency,
  SpecialAbilitySpellcasting,
  SpecialAbilitySpell,
  MonsterAction
} from '@/models/2014/monster'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import { APIReference } from '@/models/2014/types/apiReference'
import ConditionModel, { Condition } from '@/models/2014/condition'
import {
  resolveMultipleReferences,
  resolveSingleReference,
  resolveDamageChoice,
  resolveActionChoice,
  resolveBreathChoice
} from '../utils/resolvers'
import EquipmentModel from '@/models/2014/equipment'
import SpellModel, { Spell } from '@/models/2014/spell'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import { Armor, SpellSlotCount } from '@/graphql/2014rewrite/common/types'
import { DamageOrDamageChoiceUnion } from '@/graphql/2014rewrite/common/unions'
import { Damage, Choice } from '@/models/2014/common'
import { DamageChoice, ActionChoice, BreathChoice } from '@/graphql/2014rewrite/types/monsterTypes'
import {
  NumberFilterInput,
  buildMongoQueryFromNumberFilter,
  buildMongoSortQuery,
  NumberFilterInputSchema
} from '@/graphql/2014rewrite/common/inputs'

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

registerEnumType(MonsterOrderField, {
  name: 'MonsterOrderField',
  description: 'Fields to sort Monsters by'
})

const MONSTER_SORT_FIELD_MAP: Record<MonsterOrderField, string> = {
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

const MonsterArgsSchema = z.object({
  name: z.string().optional(),
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
  order_by: z.nativeEnum(MonsterOrderField).optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

const MonsterIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class MonsterArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster name (case-insensitive, partial match)'
  })
  name?: string

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

  @Field(() => MonsterOrderField, {
    nullable: true,
    description: 'Field to sort monsters by.'
  })
  order_by?: MonsterOrderField

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction for the chosen field (default: ASC)'
  })
  order_direction?: OrderByDirection

  @Field(() => Int, { nullable: true, description: 'TODO: Pass 5 - Number of results to skip' })
  skip?: number

  @Field(() => Int, {
    nullable: true,
    description: 'TODO: Pass 5 - Maximum number of results to return'
  })
  limit?: number
}

@Resolver(Monster)
export class MonsterResolver {
  @Query(() => [Monster], {
    description: 'Gets all monsters, optionally filtered and sorted.'
  })
  async monsters(@Args() args: MonsterArgs): Promise<Monster[]> {
    const validatedArgs = MonsterArgsSchema.parse(args)
    let query = MonsterModel.find()
    const filters: any[] = []

    if (validatedArgs.name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }
    if (validatedArgs.type) {
      filters.push({ type: { $regex: new RegExp(`^${escapeRegExp(validatedArgs.type)}$`, 'i') } })
    }
    if (validatedArgs.subtype) {
      filters.push({
        subtype: { $regex: new RegExp(`^${escapeRegExp(validatedArgs.subtype)}$`, 'i') }
      })
    }
    if (validatedArgs.challenge_rating) {
      const crQuery = buildMongoQueryFromNumberFilter(validatedArgs.challenge_rating)
      if (crQuery) filters.push({ challenge_rating: crQuery })
    }
    if (validatedArgs.size) {
      filters.push({ size: validatedArgs.size })
    }

    if (validatedArgs.xp) {
      const xpQuery = buildMongoQueryFromNumberFilter(validatedArgs.xp)
      if (xpQuery) filters.push({ xp: xpQuery })
    }

    const abilityScores = [
      'strength',
      'dexterity',
      'constitution',
      'intelligence',
      'wisdom',
      'charisma'
    ] as const
    for (const score of abilityScores) {
      if (validatedArgs[score]) {
        const scoreQuery = buildMongoQueryFromNumberFilter(validatedArgs[score]!)
        if (scoreQuery) filters.push({ [score]: scoreQuery })
      }
    }

    if (validatedArgs.damage_vulnerabilities && validatedArgs.damage_vulnerabilities.length > 0) {
      filters.push({
        'damage_vulnerabilities.index': { $in: validatedArgs.damage_vulnerabilities }
      })
    }
    if (validatedArgs.damage_resistances && validatedArgs.damage_resistances.length > 0) {
      filters.push({ 'damage_resistances.index': { $in: validatedArgs.damage_resistances } })
    }
    if (validatedArgs.damage_immunities && validatedArgs.damage_immunities.length > 0) {
      filters.push({ 'damage_immunities.index': { $in: validatedArgs.damage_immunities } })
    }
    if (validatedArgs.condition_immunities && validatedArgs.condition_immunities.length > 0) {
      filters.push({ 'condition_immunities.index': { $in: validatedArgs.condition_immunities } })
    }

    if (filters.length > 0) {
      query = query.where({ $and: filters })
    }

    const sortQuery = buildMongoSortQuery({
      orderBy: validatedArgs.order_by,
      orderDirection: validatedArgs.order_direction,
      sortFieldMap: MONSTER_SORT_FIELD_MAP,
      defaultSortField: MonsterOrderField.NAME
    })

    if (sortQuery) {
      query = query.sort(sortQuery)
    }

    return query.lean()
  }

  @Query(() => Monster, { nullable: true, description: 'Gets a single monster by its index.' })
  async monster(@Arg('index', () => String) indexInput: string): Promise<Monster | null> {
    const { index } = MonsterIndexArgsSchema.parse({ index: indexInput })
    return MonsterModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [Condition])
  async condition_immunities(@Root() monster: Monster): Promise<APIReference[]> {
    return resolveMultipleReferences(monster.condition_immunities, ConditionModel)
  }

  @FieldResolver(() => [Monster])
  async forms(@Root() monster: Monster): Promise<APIReference[] | null> {
    if (!monster.forms) return null
    return resolveMultipleReferences(monster.forms, MonsterModel)
  }
}

@Resolver(ArmorClassArmor)
export class ArmorClassArmorResolver {
  @FieldResolver(() => [Armor], { name: 'armor', nullable: true })
  async armor(@Root() acArmor: ArmorClassArmor): Promise<Array<typeof Armor | null>> {
    if (!acArmor.armor) return []
    return resolveMultipleReferences(acArmor.armor, EquipmentModel) as Promise<
      Array<typeof Armor | null>
    >
  }
}

@Resolver(ArmorClassSpell)
export class ArmorClassSpellResolver {
  @FieldResolver(() => Spell, { name: 'spell', nullable: true })
  async spell(@Root() acSpell: ArmorClassSpell): Promise<Spell | null> {
    return resolveSingleReference(acSpell.spell, SpellModel)
  }
}

@Resolver(ArmorClassCondition)
export class ArmorClassConditionResolver {
  @FieldResolver(() => Condition, { name: 'condition', nullable: true })
  async condition(@Root() acCondition: ArmorClassCondition): Promise<Condition | null> {
    return resolveSingleReference(acCondition.condition, ConditionModel)
  }
}

@Resolver(MonsterProficiency)
export class MonsterProficiencyResolver {
  @FieldResolver(() => Proficiency, { name: 'proficiency' })
  async proficiency(@Root() monsterProficiency: MonsterProficiency): Promise<Proficiency | null> {
    return resolveSingleReference(monsterProficiency.proficiency, ProficiencyModel)
  }
}

@Resolver(SpecialAbilitySpellcasting)
export class SpecialAbilitySpellcastingResolver {
  @FieldResolver(() => AbilityScore, { name: 'ability' })
  async ability(@Root() spellcasting: SpecialAbilitySpellcasting): Promise<AbilityScore | null> {
    return resolveSingleReference(spellcasting.ability, AbilityScoreModel)
  }

  @FieldResolver(() => [SpellSlotCount], { name: 'slots', nullable: true })
  async slots(@Root() spellcasting: SpecialAbilitySpellcasting): Promise<SpellSlotCount[] | null> {
    if (!spellcasting.slots) {
      return null
    }
    const slotCounts: SpellSlotCount[] = []
    for (const levelKey in spellcasting.slots) {
      if (Object.prototype.hasOwnProperty.call(spellcasting.slots, levelKey)) {
        const count = spellcasting.slots[levelKey]
        const slotLevel = parseInt(levelKey, 10)
        if (!isNaN(slotLevel)) {
          const slotCount = new SpellSlotCount()
          slotCount.slot_level = slotLevel
          slotCount.count = count
          slotCounts.push(slotCount)
        }
      }
    }
    return slotCounts.sort((a, b) => a.slot_level - b.slot_level)
  }
}

@Resolver(SpecialAbilitySpell)
export class SpecialAbilitySpellResolver {
  @FieldResolver(() => Spell, { name: 'spell', description: 'The resolved spell object.' })
  async resolveSpell(@Root() abilitySpell: SpecialAbilitySpell): Promise<Spell | null> {
    const spellIndex = abilitySpell.url.substring(abilitySpell.url.lastIndexOf('/') + 1)
    if (!spellIndex) return null
    return SpellModel.findOne({ index: spellIndex })
  }
}

@Resolver(MonsterAction)
export class MonsterActionResolver {
  @FieldResolver(() => [DamageOrDamageChoiceUnion], { nullable: true })
  async damage(@Root() action: MonsterAction): Promise<(Damage | DamageChoice)[] | undefined> {
    if (!action.damage) {
      return undefined
    }

    const resolvedDamage = await Promise.all(
      action.damage.map(async (item) => {
        if ('choose' in item) {
          return resolveDamageChoice(item as Choice)
        }
        return item as Damage
      })
    )

    return resolvedDamage.filter((item): item is Damage | DamageChoice => item !== null)
  }

  @FieldResolver(() => ActionChoice, { nullable: true })
  async action_options(@Root() action: MonsterAction): Promise<ActionChoice | null> {
    return resolveActionChoice(action.action_options)
  }

  @FieldResolver(() => BreathChoice, { nullable: true })
  async options(@Root() action: MonsterAction): Promise<BreathChoice | null> {
    return resolveBreathChoice(action.options)
  }
}
