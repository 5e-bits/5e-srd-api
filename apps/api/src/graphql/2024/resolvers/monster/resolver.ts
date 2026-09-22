import { FieldResolver, Resolver, Root } from 'type-graphql'

import { normalizeCount } from '@/graphql/2014/utils/helpers'
import {
  ActionChoice2024,
  ActionChoiceOption2024,
  ActionChoiceOptionSet2024,
  BreathChoice2024,
  BreathChoiceOption2024,
  BreathChoiceOptionSet2024,
  DamageChoice2024,
  DamageChoiceOption2024,
  DamageChoiceOptionSet2024,
  DamageOrDamageChoice2024Union,
  MultipleActionChoiceOption2024
} from '@/graphql/2024/types/monsterTypes'
import { createResolver } from '@/graphql/common/createResolver'
import { eqFilter, inFilter, numberFilter, regexFilter } from '@/graphql/common/filters'
import { SpellSlotCount } from '@/graphql/common/types'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore2024 } from '@/models/2024/abilityScore'
import ConditionModel, { Condition2024 } from '@/models/2024/condition'
import DamageTypeModel from '@/models/2024/damageType'
import EquipmentModel, { Equipment2024 } from '@/models/2024/equipment'
import Monster2024Model, {
  MonsterAction2024,
  MonsterArmorClass2024,
  MonsterConditionImmunity2024,
  MonsterProficiency2024,
  Monster2024,
  MonsterSpellcasting2024
} from '@/models/2024/monster'
import ProficiencyModel, { Proficiency2024 } from '@/models/2024/proficiency'
import {
  ActionOption,
  BreathOption,
  Choice,
  DamageOption,
  OptionsArrayOptionSet
} from '@/models/common/choice'
import { Damage } from '@/models/common/damage'
import { DifficultyClass } from '@/models/common/difficultyClass'

import { Monster2024Args, Monster2024ArgsSchema } from './args'

@Resolver(Monster2024)
export class Monster2024Resolver extends createResolver({
  Type: Monster2024,
  Model: Monster2024Model,
  typeName: 'Monster2024',
  singular: 'monster2024',
  plural: 'monsters2024',
  descriptions: {
    fields: 'Fields to sort 2024 Monsters by',
    order: 'Specify sorting order for monsters.',
    list: 'Gets all 2024 monsters, optionally filtered and sorted.',
    single: 'Gets a single 2024 monster by its index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' },
    TYPE: { value: 'type', path: 'type' },
    SIZE: { value: 'size', path: 'size' },
    CHALLENGE_RATING: { value: 'challenge_rating', path: 'challenge_rating' },
    STRENGTH: { value: 'strength', path: 'strength' },
    DEXTERITY: { value: 'dexterity', path: 'dexterity' },
    CONSTITUTION: { value: 'constitution', path: 'constitution' },
    INTELLIGENCE: { value: 'intelligence', path: 'intelligence' },
    WISDOM: { value: 'wisdom', path: 'wisdom' },
    CHARISMA: { value: 'charisma', path: 'charisma' }
  },
  defaultSort: 'NAME',
  Args: Monster2024Args,
  argsSchema: Monster2024ArgsSchema,
  filters: (a) => [
    regexFilter('name', a.name),
    regexFilter('type', a.type, true),
    regexFilter('subtype', a.subtype, true),
    numberFilter('challenge_rating', a.challenge_rating),
    eqFilter('size', a.size),
    numberFilter('xp', a.xp),
    ...(
      ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const
    ).map((score) => numberFilter(score, a[score])),
    inFilter('damage_vulnerabilities', a.damage_vulnerabilities),
    inFilter('damage_resistances', a.damage_resistances),
    inFilter('damage_immunities', a.damage_immunities),
    inFilter('condition_immunities.index', a.condition_immunities)
  ]
}) {
  @FieldResolver(() => [MonsterConditionImmunity2024])
  async condition_immunities(@Root() monster: Monster2024): Promise<MonsterConditionImmunity2024[]> {
    const resolved = await resolveMultipleReferences(monster.condition_immunities, ConditionModel)
    const byIndex = new Map(resolved.map((condition) => [condition.index, condition]))
    /**
     * A note (e.g. "with Mind Blank") qualifies this monster's own immunity, not the
     * condition itself, so the wrapper — not the shared Condition2024 type — carries it.
     */
    return (monster.condition_immunities ?? []).flatMap((ref) => {
      const condition = byIndex.get(ref.index)
      return condition !== undefined ? [{ condition, note: ref.note }] : []
    })
  }

  @FieldResolver(() => [Monster2024], { nullable: true })
  async forms(@Root() monster: Monster2024): Promise<Monster2024[] | null> {
    if (!monster.forms) return null
    return resolveMultipleReferences(monster.forms, Monster2024Model)
  }
}

@Resolver(MonsterArmorClass2024)
export class MonsterArmorClass2024Resolver {
  @FieldResolver(() => [Equipment2024], { nullable: true })
  async armor(@Root() ac: MonsterArmorClass2024): Promise<Equipment2024[]> {
    if (!ac.armor) return []
    return resolveMultipleReferences(ac.armor, EquipmentModel)
  }

  @FieldResolver(() => Condition2024, { nullable: true })
  async condition(@Root() ac: MonsterArmorClass2024): Promise<Condition2024 | null> {
    return resolveSingleReference(ac.condition, ConditionModel)
  }
}

@Resolver(MonsterProficiency2024)
export class MonsterProficiency2024Resolver {
  @FieldResolver(() => Proficiency2024)
  async proficiency(
    @Root() monsterProficiency: MonsterProficiency2024
  ): Promise<Proficiency2024 | null> {
    return resolveSingleReference(monsterProficiency.proficiency, ProficiencyModel)
  }
}

@Resolver(MonsterSpellcasting2024)
export class MonsterSpellcasting2024Resolver {
  @FieldResolver(() => AbilityScore2024)
  async ability(@Root() spellcasting: MonsterSpellcasting2024): Promise<AbilityScore2024 | null> {
    return resolveSingleReference(spellcasting.ability, AbilityScoreModel)
  }

  @FieldResolver(() => [SpellSlotCount], { nullable: true })
  async slots(@Root() spellcasting: MonsterSpellcasting2024): Promise<SpellSlotCount[] | null> {
    if (!spellcasting.slots) return null
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

@Resolver(MonsterAction2024)
export class MonsterAction2024Resolver {
  @FieldResolver(() => [DamageOrDamageChoice2024Union], { nullable: true })
  async damage(
    @Root() action: MonsterAction2024
  ): Promise<(Damage | DamageChoice2024)[] | undefined> {
    if (!action.damage) return undefined
    const resolved = await Promise.all(
      action.damage.map(async (item: Damage | Choice) => {
        if ('choose' in item) return resolveDamageChoice2024(item as Choice)
        return item as Damage
      })
    )
    return resolved.filter((item): item is Damage | DamageChoice2024 => item !== null)
  }

  @FieldResolver(() => ActionChoice2024, { nullable: true })
  async action_options(@Root() action: MonsterAction2024): Promise<ActionChoice2024 | null> {
    return resolveActionChoice2024(action.action_options)
  }

  @FieldResolver(() => BreathChoice2024, { nullable: true })
  async options(@Root() action: MonsterAction2024): Promise<BreathChoice2024 | null> {
    return resolveBreathChoice2024(action.options)
  }
}

async function resolveBreathChoice2024(
  choiceData: Choice | undefined | null
): Promise<BreathChoice2024 | null> {
  if (!choiceData || !('options' in choiceData.from)) return null

  const options = (choiceData.from as OptionsArrayOptionSet).options
  const validOptions: BreathChoiceOption2024[] = []

  for (const option of options) {
    if (option.option_type === 'breath') {
      const breathOption = option as BreathOption
      const abilityScore = await resolveSingleReference(breathOption.dc.dc_type, AbilityScoreModel)

      const resolvedOption: Partial<BreathChoiceOption2024> = {
        option_type: breathOption.option_type,
        name: breathOption.name,
        dc: {
          dc_type: abilityScore as AbilityScore2024,
          dc_value: breathOption.dc.dc_value,
          success_type: breathOption.dc.success_type
        } as DifficultyClass
      }

      if (breathOption.damage && breathOption.damage.length > 0) {
        const resolvedDamage = await Promise.all(
          breathOption.damage.map(async (dmg) => {
            const damageType = await resolveSingleReference(dmg.damage_type, DamageTypeModel)
            if (damageType !== null) {
              return { damage_dice: dmg.damage_dice, damage_type: damageType } as Damage
            }
            return null
          })
        )
        const filtered = resolvedDamage.filter((d): d is Damage => d !== null)
        if (filtered.length > 0) resolvedOption.damage = filtered
      }

      validOptions.push(resolvedOption as BreathChoiceOption2024)
    }
  }

  if (validOptions.length === 0) return null

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: {
      option_set_type: choiceData.from.option_set_type,
      options: validOptions
    } as BreathChoiceOptionSet2024,
    desc: choiceData.desc
  }
}

async function resolveDamageChoice2024(
  choiceData: Choice | undefined | null
): Promise<DamageChoice2024 | null> {
  if (!choiceData || !('options' in choiceData.from)) return null

  const options = (choiceData.from as OptionsArrayOptionSet).options
  const validOptions: DamageChoiceOption2024[] = []

  for (const option of options) {
    if (option.option_type === 'damage') {
      const damageOption = option as DamageOption
      const damageType = await resolveSingleReference(damageOption.damage_type, DamageTypeModel)
      if (damageType !== null) {
        validOptions.push({
          option_type: damageOption.option_type,
          damage: {
            damage_dice: damageOption.damage_dice,
            damage_type: damageType
          } as Damage
        })
      }
    }
  }

  if (validOptions.length === 0) return null

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: {
      option_set_type: choiceData.from.option_set_type,
      options: validOptions
    } as DamageChoiceOptionSet2024,
    desc: choiceData.desc
  }
}

async function resolveActionChoice2024(
  choiceData: Choice | undefined | null
): Promise<ActionChoice2024 | null> {
  if (!choiceData || !('options' in choiceData.from)) return null

  const options = (choiceData.from as OptionsArrayOptionSet).options
  const validOptions: Array<ActionChoiceOption2024 | MultipleActionChoiceOption2024> = []

  for (const option of options) {
    if (option.option_type === 'multiple') {
      const multipleOption = option as { option_type: string; items: ActionOption[] }
      const resolvedItems = multipleOption.items.map((item) => ({
        option_type: item.option_type,
        action_name: item.action_name,
        count: normalizeCount(item.count),
        type: item.type
      }))
      validOptions.push({ option_type: multipleOption.option_type, items: resolvedItems })
    } else if (option.option_type === 'action') {
      const actionOption = option as ActionOption
      validOptions.push({
        option_type: actionOption.option_type,
        action_name: actionOption.action_name,
        count: normalizeCount(actionOption.count),
        type: actionOption.type
      })
    }
  }

  if (validOptions.length === 0) return null

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    from: {
      option_set_type: choiceData.from.option_set_type,
      options: validOptions
    } as ActionChoiceOptionSet2024,
    desc: choiceData.desc
  }
}
