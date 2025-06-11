import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import { ProficiencyReference } from '@/graphql/2014/types/proficiencyTypes'
import { buildSortPipeline } from '@/graphql/common/args'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/utils/resolvers'
import AbilityScoreModel from '@/models/2014/abilityScore'
import ClassModel, { Class } from '@/models/2014/class'
import EquipmentModel from '@/models/2014/equipment'
import EquipmentCategoryModel from '@/models/2014/equipmentCategory'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import RaceModel, { Race } from '@/models/2014/race'
import SkillModel from '@/models/2014/skill'
import { escapeRegExp } from '@/util'

import {
  PROFICIENCY_SORT_FIELD_MAP,
  ProficiencyArgs,
  ProficiencyArgsSchema,
  ProficiencyIndexArgsSchema,
  ProficiencyOrderField
} from './args'

@Resolver(Proficiency)
export class ProficiencyResolver {
  @Query(() => [Proficiency], {
    description: 'Query all Proficiencies, optionally filtered and sorted.'
  })
  async proficiencies(@Args(() => ProficiencyArgs) args: ProficiencyArgs): Promise<Proficiency[]> {
    const validatedArgs = ProficiencyArgsSchema.parse(args)

    let query = ProficiencyModel.find()
    const filters: any[] = []

    if (validatedArgs.name != null && validatedArgs.name !== '') {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.class && validatedArgs.class.length > 0) {
      filters.push({ 'classes.index': { $in: validatedArgs.class } })
    }

    if (validatedArgs.race && validatedArgs.race.length > 0) {
      filters.push({ 'races.index': { $in: validatedArgs.race } })
    }

    if (validatedArgs.type && validatedArgs.type.length > 0) {
      filters.push({ type: { $in: validatedArgs.type } })
    }

    if (filters.length > 0) {
      query = query.where({ $and: filters })
    }

    const sortQuery = buildSortPipeline<ProficiencyOrderField>({
      order: validatedArgs.order,
      sortFieldMap: PROFICIENCY_SORT_FIELD_MAP,
      defaultSortField: ProficiencyOrderField.NAME
    })

    if (Object.keys(sortQuery).length > 0) {
      query.sort(sortQuery)
    }

    if (validatedArgs.skip !== undefined) {
      query = query.skip(validatedArgs.skip)
    }
    if (validatedArgs.limit !== undefined) {
      query = query.limit(validatedArgs.limit)
    }

    return query.lean()
  }

  @Query(() => Proficiency, {
    nullable: true,
    description: 'Gets a single proficiency by index.'
  })
  async proficiency(@Arg('index', () => String) indexInput: string): Promise<Proficiency | null> {
    const { index } = ProficiencyIndexArgsSchema.parse({ index: indexInput })
    return ProficiencyModel.findOne({ index }).lean()
  }

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
