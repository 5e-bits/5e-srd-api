import { Resolver, Query, Arg, Args, ArgsType, Field, Int, FieldResolver, Root } from 'type-graphql'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import ClassModel, { Class, MultiClassing, MultiClassingPrereq } from '@/models/2014/class'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { NumberFilterInput } from '../common/inputs'
import { escapeRegExp } from '@/util'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import AbilityScoreModel, { AbilityScore } from '@/models/2014/abilityScore'
import SubclassModel, { Subclass } from '@/models/2014/subclass'
import {
  resolveMultipleReferences,
  resolveProficiencyChoiceArray,
  resolveSingleReference
} from '../utils/resolvers'
import { APIReference } from '@/models/2014/types/apiReference'
import LevelModel, { Level } from '@/models/2014/level'
import SpellModel, { Spell } from '@/models/2014/spell'
import { ProficiencyChoice, PrerequisiteChoice } from '@/graphql/2014rewrite/common/choiceTypes'
import { resolvePrerequisiteChoice } from '../utils/resolvers'
import { StartingEquipmentChoice } from '../types/startingEquipment'
import { resolveStartingEquipmentChoices } from '../utils/startingEquipmentResolver'

@ArgsType()
class ClassArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by class name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by hit die size. Allows exact match, list of values, or a range.'
  })
  @IsOptional()
  hit_die?: NumberFilterInput

  // Order direction applies only to name for now
  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the name field (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(Class)
export class ClassResolver {
  @Query(() => [Class], {
    description: 'Gets all classes, optionally filtering by name or hit die and sorted by name.'
  })
  async classes(@Args() { name, hit_die, order_direction }: ClassArgs): Promise<Class[]> {
    const query = ClassModel.find()
    const filters: any[] = []

    if (name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (hit_die) {
      const hitDieQueryPortion: any = {}
      if (typeof hit_die.eq === 'number') {
        hitDieQueryPortion.$eq = hit_die.eq
      }
      if (Array.isArray(hit_die.in) && hit_die.in.length > 0) {
        hitDieQueryPortion.$in = hit_die.in
      }
      if (Array.isArray(hit_die.nin) && hit_die.nin.length > 0) {
        hitDieQueryPortion.$nin = hit_die.nin
      }
      if (hit_die.range) {
        if (typeof hit_die.range.lt === 'number') hitDieQueryPortion.$lt = hit_die.range.lt
        if (typeof hit_die.range.lte === 'number') hitDieQueryPortion.$lte = hit_die.range.lte
        if (typeof hit_die.range.gt === 'number') hitDieQueryPortion.$gt = hit_die.range.gt
        if (typeof hit_die.range.gte === 'number') hitDieQueryPortion.$gte = hit_die.range.gte
      }
      if (Object.keys(hitDieQueryPortion).length > 0) {
        filters.push({ hit_die: hitDieQueryPortion })
      }
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => Class, { nullable: true, description: 'Gets a single class by its index.' })
  async class(@Arg('index', () => String) index: string): Promise<Class | null> {
    return ClassModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [Level])
  async class_levels(@Root() classData: Class): Promise<Level[]> {
    return LevelModel.find({
      'class.index': classData.index,
      subclass: { $exists: false }
    })
      .sort({ level: 1 })
      .lean()
  }

  @FieldResolver(() => [Proficiency])
  async proficiencies(@Root() classData: Class): Promise<APIReference[]> {
    return resolveMultipleReferences(classData.proficiencies, ProficiencyModel)
  }

  @FieldResolver(() => [AbilityScore])
  async saving_throws(@Root() classData: Class): Promise<APIReference[]> {
    return resolveMultipleReferences(classData.saving_throws, AbilityScoreModel)
  }

  @FieldResolver(() => [Subclass])
  async subclasses(@Root() classData: Class): Promise<APIReference[]> {
    return resolveMultipleReferences(classData.subclasses, SubclassModel)
  }

  @FieldResolver(() => [Spell])
  async spells(@Root() classData: Class): Promise<Spell[]> {
    return SpellModel.find({ 'classes.index': classData.index }).sort({ level: 1, name: 1 }).lean()
  }

  @FieldResolver(() => [ProficiencyChoice])
  async proficiency_choices(@Root() classData: Class): Promise<ProficiencyChoice[]> {
    return resolveProficiencyChoiceArray(classData.proficiency_choices)
  }

  @FieldResolver(() => [StartingEquipmentChoice], {
    nullable: true,
    description: 'Resolves starting equipment choices for the class.'
  })
  async starting_equipment_options(
    @Root() classData: Class
  ): Promise<StartingEquipmentChoice[] | null> {
    return resolveStartingEquipmentChoices(classData.starting_equipment_options)
  }
}

@Resolver(MultiClassing)
export class MultiClassingResolver {
  @FieldResolver(() => [Proficiency])
  async proficiencies(@Root() multiClassing: MultiClassing): Promise<APIReference[]> {
    return resolveMultipleReferences(multiClassing.proficiencies, ProficiencyModel)
  }

  @FieldResolver(() => [ProficiencyChoice])
  async proficiency_choices(@Root() multiClassing: MultiClassing): Promise<ProficiencyChoice[]> {
    return resolveProficiencyChoiceArray(multiClassing.proficiency_choices)
  }

  @FieldResolver(() => PrerequisiteChoice)
  async prerequisite_options(
    @Root() multiClassing: MultiClassing
  ): Promise<PrerequisiteChoice | null> {
    return resolvePrerequisiteChoice(multiClassing.prerequisite_options)
  }
}

@Resolver(MultiClassingPrereq)
export class MultiClassingPrereqResolver {
  @FieldResolver(() => AbilityScore)
  async ability_score(@Root() prerequisite: MultiClassingPrereq): Promise<APIReference | null> {
    return resolveSingleReference(prerequisite.ability_score, AbilityScoreModel)
  }
}
