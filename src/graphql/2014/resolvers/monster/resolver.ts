import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { Armor } from '@/graphql/2014/common/equipmentTypes'
import {
  DamageOrDamageChoiceUnion,
  ActionChoice,
  ActionChoiceOption,
  BreathChoice,
  BreathChoiceOption,
  DamageChoice,
  DamageChoiceOption,
  MultipleActionChoiceOption,
  MonsterArmorClassUnion
} from '@/graphql/2014/types/monsterTypes'
import { normalizeCount } from '@/graphql/2014/utils/helpers'
import { buildSortPipeline } from '@/graphql/common/args'
import { buildMongoQueryFromNumberFilter } from '@/graphql/common/inputs'
import { SpellSlotCount } from '@/graphql/common/types'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import ConditionModel, { Condition } from '@/models/2014/condition'
import DamageTypeModel, { DamageType } from '@/models/2014/damageType'
import EquipmentModel from '@/models/2014/equipment'
import MonsterModel, {
  ArmorClassArmor,
  ArmorClassCondition,
  ArmorClassSpell,
  Monster,
  MonsterAction,
  MonsterProficiency,
  SpecialAbilitySpell,
  SpecialAbilitySpellcasting
} from '@/models/2014/monster'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import SpellModel, { Spell } from '@/models/2014/spell'
import { APIReference } from '@/models/common/apiReference'
import {
  ActionOption,
  BreathOption,
  Choice,
  DamageOption,
  OptionsArrayOptionSet
} from '@/models/common/choice'
import { Damage } from '@/models/common/damage'
import { DifficultyClass } from '@/models/common/difficultyClass'
import { escapeRegExp } from '@/util'

import {
  MONSTER_SORT_FIELD_MAP,
  MonsterArgs,
  MonsterArgsSchema,
  MonsterIndexArgsSchema,
  MonsterOrderField
} from './args'

@Resolver(Monster)
export class MonsterResolver {
  @Query(() => [Monster], {
    description: 'Gets all monsters, optionally filtered and sorted.'
  })
  async monsters(@Args(() => MonsterArgs) args: MonsterArgs): Promise<Monster[]> {
    const validatedArgs = MonsterArgsSchema.parse(args)
    let query = MonsterModel.find()
    const filters: any[] = []

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }
    if (validatedArgs.type != null && validatedArgs.type !== '') {
      filters.push({ type: { $regex: new RegExp(`^${escapeRegExp(validatedArgs.type)}$`, 'i') } })
    }
    if (validatedArgs.subtype != null && validatedArgs.subtype !== '') {
      filters.push({
        subtype: { $regex: new RegExp(`^${escapeRegExp(validatedArgs.subtype)}$`, 'i') }
      })
    }
    if (validatedArgs.challenge_rating) {
      const crQuery = buildMongoQueryFromNumberFilter(validatedArgs.challenge_rating)
      if (crQuery) filters.push({ challenge_rating: crQuery })
    }
    if (validatedArgs.size != null && validatedArgs.size !== '') {
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

    const sortQuery = buildSortPipeline<MonsterOrderField>({
      order: validatedArgs.order,
      sortFieldMap: MONSTER_SORT_FIELD_MAP,
      defaultSortField: MonsterOrderField.NAME
    })

    if (Object.keys(sortQuery).length > 0) {
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

  @FieldResolver(() => [MonsterArmorClassUnion], { name: 'armor_class' })
  async armor_class(@Root() monster: Monster): Promise<Array<typeof MonsterArmorClassUnion>> {
    return monster.armor_class as Array<typeof MonsterArmorClassUnion>
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

@Resolver(DifficultyClass)
export class DifficultyClassResolver {
  @FieldResolver(() => AbilityScore, {
    name: 'dc_type',
    description: 'The ability score associated with this DC, resolved from its API reference.'
  })
  async dc_type(@Root() difficultyClass: DifficultyClass): Promise<AbilityScore | null> {
    return resolveSingleReference(difficultyClass.dc_type as APIReference, AbilityScoreModel)
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
            if (resolvedDamageType !== null) {
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
      if (damageType !== null) {
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
