import { Resolver, Query, Arg, Args, FieldResolver, Root } from 'type-graphql'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import { escapeRegExp } from '@/util'
import ClassModel, { Class } from '@/models/2014/class'
import RaceModel, { Race } from '@/models/2014/race'
import { resolveMultipleReferences, resolveSingleReference } from '@/graphql/2014/utils/resolvers'
import { ProficiencyReference } from '@/graphql/2014/types/proficiencyTypes'
import EquipmentModel from '@/models/2014/equipment'
import EquipmentCategoryModel from '@/models/2014/equipmentCategory'
import AbilityScoreModel from '@/models/2014/abilityScore'
import SkillModel from '@/models/2014/skill'
import { buildMongoSortQuery } from '@/graphql/2014/common/inputs'
import {
  ProficiencyArgs,
  ProficiencyArgsSchema,
  ProficiencyIndexArgsSchema,
  ProficiencyOrderField,
  PROFICIENCY_SORT_FIELD_MAP
} from './args'

@Resolver(Proficiency)
export class ProficiencyResolver {
  @Query(() => [Proficiency], {
    description: 'Query all Proficiencies, optionally filtered and sorted.'
  })
  async proficiencies(@Args() args: ProficiencyArgs): Promise<Proficiency[]> {
    const validatedArgs = ProficiencyArgsSchema.parse(args)

    let query = ProficiencyModel.find()
    const filters: any[] = []

    if (validatedArgs.name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(validatedArgs.name), 'i') } })
    }

    if (validatedArgs.class?.length) {
      filters.push({ 'classes.index': { $in: validatedArgs.class } })
    }

    if (validatedArgs.race?.length) {
      filters.push({ 'races.index': { $in: validatedArgs.race } })
    }

    if (validatedArgs.type?.length) {
      filters.push({ type: { $in: validatedArgs.type } })
    }

    if (filters.length > 0) {
      query = query.where({ $and: filters })
    }

    const sort = buildMongoSortQuery({
      orderBy: validatedArgs.order_by,
      orderDirection: validatedArgs.order_direction,
      sortFieldMap: PROFICIENCY_SORT_FIELD_MAP,
      defaultSortField: ProficiencyOrderField.NAME
    })
    if (sort) {
      query.sort(sort)
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
