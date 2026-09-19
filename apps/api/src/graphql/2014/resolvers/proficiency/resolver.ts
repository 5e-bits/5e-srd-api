import { FieldResolver, Resolver, Root } from 'type-graphql'

import { ProficiencyReference } from '@/graphql/2014/types/proficiencyTypes'
import { createResolver } from '@/graphql/common/createResolver'
import { inFilter, regexFilter } from '@/graphql/common/filters'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel from '@/models/2014/abilityScore'
import ClassModel, { Class } from '@/models/2014/class'
import EquipmentModel from '@/models/2014/equipment'
import EquipmentCategoryModel from '@/models/2014/equipmentCategory'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import RaceModel, { Race } from '@/models/2014/race'
import SkillModel from '@/models/2014/skill'

import { ProficiencyArgs, ProficiencyArgsSchema } from './args'

@Resolver(Proficiency)
export class ProficiencyResolver extends createResolver({
  Type: Proficiency,
  Model: ProficiencyModel,
  typeName: 'Proficiency',
  singular: 'proficiency',
  plural: 'proficiencies',
  descriptions: {
    fields: 'Fields to sort Proficiencies by',
    order: 'Specify sorting order for proficiencies. Allows nested sorting.',
    list: 'Query all Proficiencies, optionally filtered and sorted.',
    single: 'Gets a single proficiency by index.'
  },
  orderFields: {
    NAME: { value: 'name', path: 'name' },
    TYPE: { value: 'type', path: 'type' }
  },
  defaultSort: 'NAME',
  Args: ProficiencyArgs,
  argsSchema: ProficiencyArgsSchema,
  filters: (a) => [
    regexFilter('name', a.name),
    inFilter('classes.index', a.class),
    inFilter('races.index', a.race),
    inFilter('type', a.type)
  ]
}) {
  @FieldResolver(() => [Class], { nullable: true })
  async classes(@Root() proficiency: Proficiency): Promise<Class[]> {
    return resolveMultipleReferences(proficiency.classes, ClassModel)
  }

  @FieldResolver(() => [Race], { nullable: true })
  async races(@Root() proficiency: Proficiency): Promise<Race[]> {
    return resolveMultipleReferences(proficiency.races, RaceModel)
  }

  @FieldResolver(() => ProficiencyReference, { nullable: true })
  async reference(@Root() proficiency: Proficiency): Promise<typeof ProficiencyReference | null> {
    const ref = proficiency.reference
    if (!ref?.index || !ref.url) {
      return null
    }

    if (ref.url.includes('/equipment-categories/')) {
      return resolveSingleReference(ref, EquipmentCategoryModel)
    }
    if (ref.url.includes('/skills/')) {
      return resolveSingleReference(ref, SkillModel)
    }
    if (ref.url.includes('/ability-scores/')) {
      return resolveSingleReference(ref, AbilityScoreModel)
    }
    if (ref.url.includes('/equipment/')) {
      return resolveSingleReference(ref, EquipmentModel)
    }

    console.warn(
      `Unable to determine reference type from URL: ${ref.url} (Proficiency index: ${proficiency.index})`
    )
    return null
  }
}
