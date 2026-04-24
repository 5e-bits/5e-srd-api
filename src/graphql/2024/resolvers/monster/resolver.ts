import { Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

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
import { buildSortPipeline } from '@/graphql/common/args'
import { buildMongoQueryFromNumberFilter } from '@/graphql/common/inputs'
import { SpellSlotCount } from '@/graphql/common/types'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore2024 } from '@/models/2024/abilityScore'
import ConditionModel, { Condition2024 } from '@/models/2024/condition'
import DamageTypeModel from '@/models/2024/damageType'
import EquipmentModel, { Equipment2024 } from '@/models/2024/equipment'
import Monster2024Model, {
  MonsterAction2024,
  MonsterArmorClass2024,
  MonsterProficiency2024,
  Monster2024,
  Spellcasting2024
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
import { escapeRegExp } from '@/util'

import {
  MONSTER2024_SORT_FIELD_MAP,
  Monster2024Args,
  Monster2024ArgsSchema,
  Monster2024IndexArgs,
  Monster2024IndexArgsSchema,
  Monster2024OrderField
} from './args'

@Resolver(Monster2024)
export class Monster2024Resolver {
  @Query(() => [Monster2024], {
    description: 'Gets all 2024 monsters, optionally filtered and sorted.'
  })
  async monsters2024(@Args(() => Monster2024Args) args: Monster2024Args): Promise<Monster2024[]> {
    const validatedArgs = Monster2024ArgsSchema.parse(args)
    let query = Monster2024Model.find()
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
      filters.push({ damage_vulnerabilities: { $in: validatedArgs.damage_vulnerabilities } })
    }
    if (validatedArgs.damage_resistances && validatedArgs.damage_resistances.length > 0) {
      filters.push({ damage_resistances: { $in: validatedArgs.damage_resistances } })
    }
    if (validatedArgs.damage_immunities && validatedArgs.damage_immunities.length > 0) {
      filters.push({ damage_immunities: { $in: validatedArgs.damage_immunities } })
    }
    if (validatedArgs.condition_immunities && validatedArgs.condition_immunities.length > 0) {
      filters.push({ 'condition_immunities.index': { $in: validatedArgs.condition_immunities } })
    }

    if (filters.length > 0) {
      query = query.where({ $and: filters })
    }

    const sortQuery = buildSortPipeline<Monster2024OrderField>({
      order: validatedArgs.order,
      sortFieldMap: MONSTER2024_SORT_FIELD_MAP,
      defaultSortField: Monster2024OrderField.NAME
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

  @Query(() => Monster2024, {
    nullable: true,
    description: 'Gets a single 2024 monster by its index.'
  })
  async monster2024(
    @Args(() => Monster2024IndexArgs) args: Monster2024IndexArgs
  ): Promise<Monster2024 | null> {
    const { index } = Monster2024IndexArgsSchema.parse(args)
    return Monster2024Model.findOne({ index }).lean()
  }

  @FieldResolver(() => [Condition2024])
  async condition_immunities(@Root() monster: Monster2024): Promise<Condition2024[]> {
    return resolveMultipleReferences(monster.condition_immunities, ConditionModel)
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

@Resolver(Spellcasting2024)
export class MonsterSpellcasting2024Resolver {
  @FieldResolver(() => AbilityScore2024)
  async ability(@Root() spellcasting: Spellcasting2024): Promise<AbilityScore2024 | null> {
    return resolveSingleReference(spellcasting.ability, AbilityScoreModel)
  }

  @FieldResolver(() => [SpellSlotCount], { nullable: true })
  async slots(@Root() spellcasting: Spellcasting2024): Promise<SpellSlotCount[] | null> {
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
