import { Resolver, Query, Arg, Args, ArgsType, Field, Int, FieldResolver, Root } from 'type-graphql'
import { IsOptional, IsString, IsEnum, IsIn } from 'class-validator'
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
  resolveDamageChoice
} from '../utils/resolvers'
import EquipmentModel from '@/models/2014/equipment'
import SpellModel, { Spell } from '@/models/2014/spell'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import { Armor, SpellSlotCount } from '@/graphql/2014rewrite/common/types'
import { DamageOrDamageChoiceUnion } from '@/graphql/2014rewrite/common/unions'
import { Damage, Choice } from '@/models/2014/common'
import { DamageChoice } from '@/graphql/2014rewrite/types/monsterTypes'

@ArgsType()
class MonsterArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster type (case-insensitive, exact match)'
  })
  @IsOptional()
  @IsString()
  type?: string

  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster subtype (case-insensitive, exact match)'
  })
  @IsOptional()
  @IsString()
  subtype?: string

  @Field(() => [Int], {
    nullable: true,
    description: 'Filter by challenge rating values'
  })
  @IsOptional()
  @IsIn(
    [
      0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30
    ],
    { each: true }
  )
  challenge_rating?: number[]

  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster size (case-insensitive, exact match)'
  })
  @IsOptional()
  @IsString()
  size?: string

  @Field(() => String, {
    nullable: true,
    description: 'Filter by monster alignment (case-insensitive, exact match)'
  })
  @IsOptional()
  @IsString()
  alignment?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the name field (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(Monster)
export class MonsterResolver {
  @Query(() => [Monster], {
    description:
      'Gets all monsters, optionally filtering by name, type, or challenge rating and sorted by name.'
  })
  async monsters(@Args() args: MonsterArgs): Promise<Monster[]> {
    const query = MonsterModel.find()
    const filters: any = {}

    if (args.name) {
      filters.name = { $regex: new RegExp(escapeRegExp(args.name), 'i') }
    }

    if (args.type) {
      filters.type = { $regex: new RegExp(`^${escapeRegExp(args.type)}$`, 'i') }
    }

    if (args.subtype) {
      filters.subtype = { $regex: new RegExp(`^${escapeRegExp(args.subtype)}$`, 'i') }
    }

    if (args.challenge_rating && args.challenge_rating.length > 0) {
      filters.challenge_rating = { $in: args.challenge_rating }
    }

    if (args.size) {
      filters.size = { $regex: new RegExp(`^${escapeRegExp(args.size)}$`, 'i') }
    }

    if (args.alignment) {
      filters.alignment = { $regex: new RegExp(`^${escapeRegExp(args.alignment)}$`, 'i') }
    }

    if (Object.keys(filters).length > 0) {
      query.where(filters)
    }

    if (args.order_direction) {
      const sortOrder = args.order_direction === OrderByDirection.DESC ? -1 : 1
      query.sort({ name: sortOrder })
    }

    return query.lean()
  }

  @Query(() => Monster, { nullable: true, description: 'Gets a single monster by its index.' })
  async monster(@Arg('index', () => String) index: string): Promise<Monster | null> {
    return MonsterModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [Condition])
  async condition_immunities(@Root() monster: Monster): Promise<APIReference[]> {
    if (!monster.condition_immunities) return []
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
    if (!acSpell.spell) return null
    return resolveSingleReference(acSpell.spell, SpellModel)
  }
}

@Resolver(ArmorClassCondition)
export class ArmorClassConditionResolver {
  @FieldResolver(() => Condition, { name: 'condition', nullable: true })
  async condition(@Root() acCondition: ArmorClassCondition): Promise<Condition | null> {
    if (!acCondition.condition) return null
    return resolveSingleReference(acCondition.condition, ConditionModel)
  }
}

// Resolver for the `proficiency` field within the local `MonsterProficiency` type
@Resolver(MonsterProficiency)
export class MonsterProficiencyResolver {
  @FieldResolver(() => Proficiency, { name: 'proficiency' })
  async proficiency(@Root() monsterProficiency: MonsterProficiency): Promise<Proficiency | null> {
    return resolveSingleReference(monsterProficiency.proficiency, ProficiencyModel)
  }
}

// Resolver for SpecialAbilitySpellcasting.ability
@Resolver(SpecialAbilitySpellcasting)
export class SpecialAbilitySpellcastingResolver {
  @FieldResolver(() => AbilityScore, { name: 'ability' })
  async ability(@Root() spellcasting: SpecialAbilitySpellcasting): Promise<AbilityScore | null> {
    if (!spellcasting.ability) return null
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
        // Ensure levelKey is a number, common/types.ts defines slot_level as number
        const slotLevel = parseInt(levelKey, 10)
        if (!isNaN(slotLevel)) {
          const slotCount = new SpellSlotCount()
          slotCount.slot_level = slotLevel
          slotCount.count = count
          slotCounts.push(slotCount)
        }
      }
    }
    return slotCounts.sort((a, b) => a.slot_level - b.slot_level) // Optional: sort by slot level
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
}
