import { Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { buildSortPipeline } from '@/graphql/common/args'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel, { AbilityScore2024 } from '@/models/2024/abilityScore'
import ClassModel, {
  Class2024,
  MultiClassing2024,
  MultiClassingPrereq2024,
  PrimaryAbility2024,
  Spellcasting2024
} from '@/models/2024/class'
import ProficiencyModel, { Proficiency2024 } from '@/models/2024/proficiency'
import SubclassModel, { Subclass2024 } from '@/models/2024/subclass'
import { escapeRegExp } from '@/util'

import {
  CLASS_SORT_FIELD_MAP,
  ClassArgs,
  ClassArgsSchema,
  ClassIndexArgs,
  ClassIndexArgsSchema,
  ClassOrderField
} from './args'

@Resolver(Class2024)
export class ClassResolver {
  @Query(() => [Class2024], {
    description: 'Gets all classes, optionally filtered by name.'
  })
  async classes(@Args(() => ClassArgs) args: ClassArgs): Promise<Class2024[]> {
    const validatedArgs = ClassArgsSchema.parse(args)
    const query = ClassModel.find()

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      query.where({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    const sortQuery = buildSortPipeline<ClassOrderField>({
      order: validatedArgs.order,
      sortFieldMap: CLASS_SORT_FIELD_MAP,
      defaultSortField: ClassOrderField.NAME
    })

    if (Object.keys(sortQuery).length > 0) {
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

  @Query(() => Class2024, {
    nullable: true,
    description: 'Gets a single class by index.'
  })
  async class(@Args(() => ClassIndexArgs) args: ClassIndexArgs): Promise<Class2024 | null> {
    const { index } = ClassIndexArgsSchema.parse(args)
    return ClassModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [Proficiency2024], { nullable: true })
  async proficiencies(@Root() classData: Class2024): Promise<Proficiency2024[]> {
    return resolveMultipleReferences(classData.proficiencies, ProficiencyModel)
  }

  @FieldResolver(() => [AbilityScore2024], { nullable: true })
  async saving_throws(@Root() classData: Class2024): Promise<AbilityScore2024[]> {
    return resolveMultipleReferences(classData.saving_throws, AbilityScoreModel)
  }

  @FieldResolver(() => [Subclass2024], { nullable: true })
  async subclasses(@Root() classData: Class2024): Promise<Subclass2024[]> {
    return resolveMultipleReferences(classData.subclasses, SubclassModel)
  }
}

@Resolver(MultiClassing2024)
export class MultiClassing2024Resolver {
  @FieldResolver(() => [Proficiency2024], { nullable: true })
  async proficiencies(@Root() multiClassing: MultiClassing2024): Promise<Proficiency2024[]> {
    return resolveMultipleReferences(multiClassing.proficiencies, ProficiencyModel)
  }
}

@Resolver(Spellcasting2024)
export class Spellcasting2024Resolver {
  @FieldResolver(() => AbilityScore2024, { nullable: true })
  async spellcasting_ability(
    @Root() spellcasting: Spellcasting2024
  ): Promise<AbilityScore2024 | null> {
    return resolveSingleReference(spellcasting.spellcasting_ability, AbilityScoreModel)
  }
}

@Resolver(MultiClassingPrereq2024)
export class MultiClassingPrereq2024Resolver {
  @FieldResolver(() => AbilityScore2024, { nullable: true })
  async ability_score(@Root() prereq: MultiClassingPrereq2024): Promise<AbilityScore2024 | null> {
    return resolveSingleReference(prereq.ability_score, AbilityScoreModel)
  }
}

@Resolver(PrimaryAbility2024)
export class PrimaryAbility2024Resolver {
  @FieldResolver(() => [AbilityScore2024], { nullable: true })
  async all_of(@Root() primaryAbility: PrimaryAbility2024): Promise<AbilityScore2024[]> {
    return resolveMultipleReferences(primaryAbility.all_of, AbilityScoreModel)
  }
}
