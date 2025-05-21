import {
  Resolver,
  Query,
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Root,
  registerEnumType
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
import { escapeRegExp } from '@/util'
import { APIReference } from '@/models/2014/common/apiReference'
import ConditionModel, { Condition } from '@/models/2014/condition'
import { resolveMultipleReferences, resolveSingleReference } from '../utils/resolvers'
import EquipmentModel from '@/models/2014/equipment'
import SpellModel, { Spell } from '@/models/2014/spell'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import DamageTypeModel, { DamageType } from '@/models/2014/damageType'
import { Armor, SpellSlotCount } from '@/graphql/2014/common/types'
import { DamageOrDamageChoiceUnion } from '@/graphql/2014/common/unions'
import {
  Choice,
  OptionsArrayOptionSet,
  DamageOption,
  ActionOption,
  BreathOption
} from '@/models/2014/common/choice'
import { Damage } from '@/models/2014/common/damage'
import {
  DamageChoice,
  ActionChoice,
  BreathChoice,
  DamageChoiceOption,
  ActionChoiceOption,
  MultipleActionChoiceOption,
  BreathChoiceOption
} from '@/graphql/2014/types/monsterTypes'
import {
  NumberFilterInput,
  buildMongoQueryFromNumberFilter,
  buildMongoSortQuery,
  NumberFilterInputSchema
} from '@/graphql/2014/common/inputs'
import { BaseFilterArgs, BaseFilterArgsSchema } from '../common/args'
import { normalizeCount } from '../utils/helpers'

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

const MonsterArgsSchema = BaseFilterArgsSchema.extend({
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
  order_by: z.nativeEnum(MonsterOrderField).optional()
})

const MonsterIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class MonsterArgs extends BaseFilterArgs {
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

    if (validatedArgs.skip !== undefined) {
      query = query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit !== undefined) {
      query = query.limit(validatedArgs.limit)
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
      action.damage.map(async (item: Damage | Choice) => {
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

async function resolveBreathChoice(
  choiceData: Choice | undefined | null
): Promise<BreathChoice | null> {
  if (!choiceData || !('options' in choiceData.from)) {
    return null
  }
  const options = (choiceData.from as OptionsArrayOptionSet).options
  const validOptions: BreathChoiceOption[] = []

  for (const option of options) {
    if (option.option_type === 'breath') {
      const breathOption = option as BreathOption
      const abilityScore = await resolveSingleReference(breathOption.dc.dc_type, AbilityScoreModel)

      const currentResolvedOption: Partial<BreathChoiceOption> = {
        option_type: breathOption.option_type,
        name: breathOption.name,
        dc: {
          dc_type: abilityScore as AbilityScore,
          dc_value: breathOption.dc.dc_value,
          success_type: breathOption.dc.success_type
        }
      }

      if (breathOption.damage && breathOption.damage.length > 0) {
        const resolvedDamageItems = await Promise.all(
          breathOption.damage.map(async (damageItem) => {
            const resolvedDamageType = await resolveSingleReference(
              damageItem.damage_type,
              DamageTypeModel
            )
            if (resolvedDamageType) {
              return {
                damage_dice: damageItem.damage_dice,
                damage_type: resolvedDamageType as DamageType
              }
            }
            return null
          })
        )

        const filteredDamageItems = resolvedDamageItems.filter((item) => item !== null)
        if (filteredDamageItems.length > 0) {
          currentResolvedOption.damage = filteredDamageItems as any[]
        }
      }
      validOptions.push(currentResolvedOption as BreathChoiceOption)
    }
  }

  if (validOptions.length === 0) {
    return null
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: {
      option_set_type: choiceData.from.option_set_type,
      options: validOptions
    },
    desc: choiceData.desc
  }
}

async function resolveDamageChoice(
  choiceData: Choice | undefined | null
): Promise<DamageChoice | null> {
  if (!choiceData || !('options' in choiceData.from)) {
    return null
  }
  const options = (choiceData.from as OptionsArrayOptionSet).options
  const validOptions: DamageChoiceOption[] = []

  for (const option of options) {
    if (option.option_type === 'damage') {
      const damageOption = option as DamageOption
      const damageType = await resolveSingleReference(damageOption.damage_type, DamageTypeModel)
      if (damageType) {
        const resolvedOption: DamageChoiceOption = {
          option_type: damageOption.option_type,
          damage: {
            damage_dice: damageOption.damage_dice,
            damage_type: damageType as DamageType
          }
        }
        validOptions.push(resolvedOption)
      }
    }
  }

  if (validOptions.length === 0) {
    return null
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: {
      option_set_type: choiceData.from.option_set_type,
      options: validOptions
    },
    desc: choiceData.desc
  }
}

async function resolveActionChoice(
  choiceData: Choice | undefined | null
): Promise<ActionChoice | null> {
  if (!choiceData || !('options' in choiceData.from)) {
    return null
  }
  const options = (choiceData.from as OptionsArrayOptionSet).options
  const validOptions: Array<ActionChoiceOption | MultipleActionChoiceOption> = []

  for (const option of options) {
    if (option.option_type === 'multiple') {
      const multipleOption = option as { option_type: string; items: ActionOption[] }
      const resolvedItems = multipleOption.items.map((item) => ({
        option_type: item.option_type,
        action_name: item.action_name,
        count: normalizeCount(item.count),
        type: item.type
      }))
      validOptions.push({
        option_type: multipleOption.option_type,
        items: resolvedItems
      })
    } else if (option.option_type === 'action') {
      const actionOption = option as ActionOption
      const resolvedOption: ActionChoiceOption = {
        option_type: actionOption.option_type,
        action_name: actionOption.action_name,
        count: normalizeCount(actionOption.count),
        type: actionOption.type
      }
      validOptions.push(resolvedOption)
    }
  }

  if (validOptions.length === 0) {
    return null
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: {
      option_set_type: choiceData.from.option_set_type,
      options: validOptions
    },
    desc: choiceData.desc
  }
}
