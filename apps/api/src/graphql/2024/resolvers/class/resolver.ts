import { FieldResolver, Resolver, Root } from 'type-graphql'

import { AbilityScoreChoice2024 } from '@/graphql/2024/common/choiceTypes'
import { resolveAbilityScoreChoice2024 } from '@/graphql/2024/utils/choiceResolvers'
import { createResolver } from '@/graphql/common/createResolver'
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

@Resolver(Class2024)
export class ClassResolver extends createResolver({
  Type: Class2024,
  Model: ClassModel,
  typeName: 'Class',
  singular: 'class',
  plural: 'classes',
  descriptions: {
    fields: 'Fields to sort Classes by',
    order: 'Specify sorting order for classes.',
    list: 'Gets all classes, optionally filtered by name.',
    single: 'Gets a single class by index.'
  }
}) {
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
  async ability_scores(@Root() primaryAbility: PrimaryAbility2024): Promise<AbilityScore2024[]> {
    return resolveMultipleReferences(primaryAbility.ability_scores, AbilityScoreModel)
  }

  @FieldResolver(() => AbilityScoreChoice2024, { nullable: true })
  async ability_score_options(
    @Root() primaryAbility: PrimaryAbility2024
  ): Promise<AbilityScoreChoice2024 | null> {
    return resolveAbilityScoreChoice2024(primaryAbility.ability_score_options)
  }
}
