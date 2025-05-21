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
import ClassModel, { Class, MultiClassing, MultiClassingPrereq } from '@/models/2014/class'
import { OrderByDirection } from '@/graphql/2014/common/enums'
import {
  NumberFilterInput,
  buildMongoQueryFromNumberFilter,
  buildMongoSortQuery,
  NumberFilterInputSchema
} from '../common/inputs'
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
import {
  ProficiencyChoice,
  PrerequisiteChoice,
  PrerequisiteChoiceOption,
  PrerequisiteChoiceOptionSet
} from '@/graphql/2014/common/choiceTypes'
import { StartingEquipmentChoice } from '../types/startingEquipment'
import { resolveStartingEquipmentChoices } from '../utils/startingEquipmentResolver'
import { BasePaginationArgs, BasePaginationArgsSchema } from '../common/args'
import { Choice, OptionsArrayOptionSet, ScorePrerequisiteOption } from '@/models/2014/common'

export enum ClassOrderField {
  NAME = 'name',
  HIT_DIE = 'hit_die'
}

registerEnumType(ClassOrderField, {
  name: 'ClassOrderField',
  description: 'Fields to sort Classes by'
})

const CLASS_SORT_FIELD_MAP: Record<ClassOrderField, string> = {
  [ClassOrderField.NAME]: 'name',
  [ClassOrderField.HIT_DIE]: 'hit_die'
}

const ClassArgsSchema = z
  .object({
    name: z.string().optional(),
    hit_die: NumberFilterInputSchema.optional(),
    order_by: z.nativeEnum(ClassOrderField).optional(),
    order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC)
  })
  .merge(BasePaginationArgsSchema)

const ClassIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

@ArgsType()
class ClassArgs extends BasePaginationArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by class name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => NumberFilterInput, {
    nullable: true,
    description: 'Filter by hit die size. Allows exact match, list of values, or a range.'
  })
  hit_die?: NumberFilterInput

  @Field(() => ClassOrderField, {
    nullable: true,
    description: 'Field to sort classes by.'
  })
  order_by?: ClassOrderField

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction for the chosen field'
  })
  order_direction?: OrderByDirection
}

@Resolver(Class)
export class ClassResolver {
  @Query(() => [Class], {
    description: 'Gets all classes, optionally filtering by name or hit die and sorted.'
  })
  async classes(@Args() args: ClassArgs): Promise<Class[]> {
    const validatedArgs = ClassArgsSchema.parse(args)

    const query = ClassModel.find()
    const filters: any[] = []

    if (validatedArgs.name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.hit_die) {
      const hitDieQuery = buildMongoQueryFromNumberFilter(validatedArgs.hit_die)
      if (hitDieQuery) {
        filters.push({ hit_die: hitDieQuery })
      }
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    const sortQuery = buildMongoSortQuery<ClassOrderField>({
      orderBy: validatedArgs.order_by,
      orderDirection: validatedArgs.order_direction,
      sortFieldMap: CLASS_SORT_FIELD_MAP,
      defaultSortField: ClassOrderField.NAME
    })
    if (sortQuery) {
      query.sort(sortQuery)
    }

    if (validatedArgs.skip) {
      query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit) {
      query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => Class, { nullable: true, description: 'Gets a single class by its index.' })
  async class(@Arg('index', () => String) indexInput: string): Promise<Class | null> {
    const { index } = ClassIndexArgsSchema.parse({ index: indexInput })
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

async function resolvePrerequisiteChoice(
  choiceData: Choice | undefined | null
): Promise<PrerequisiteChoice | null> {
  if (!choiceData || !choiceData.type || typeof choiceData.choose !== 'number') {
    return null
  }

  const gqlEmbeddedOptions: PrerequisiteChoiceOption[] = []

  const optionsArraySet = choiceData.from as OptionsArrayOptionSet
  for (const opt of optionsArraySet.options) {
    if (opt.option_type === 'score_prerequisite') {
      const scoreOpt = opt as ScorePrerequisiteOption
      const abilityScore = await resolveSingleReference(scoreOpt.ability_score, AbilityScoreModel)
      if (abilityScore) {
        gqlEmbeddedOptions.push({
          option_type: scoreOpt.option_type,
          ability_score: abilityScore as AbilityScore,
          minimum_score: scoreOpt.minimum_score
        })
      }
    }
  }

  if (gqlEmbeddedOptions.length === 0 && optionsArraySet.options.length > 0) {
    return null
  }

  const gqlOptionSet: PrerequisiteChoiceOptionSet = {
    option_set_type: choiceData.from.option_set_type,
    options: gqlEmbeddedOptions
  }

  return {
    choose: choiceData.choose,
    type: choiceData.type,
    desc: choiceData.desc,
    from: gqlOptionSet
  }
}
