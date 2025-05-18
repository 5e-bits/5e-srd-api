import {
  Resolver,
  Query,
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Root,
  registerEnumType,
  Int
} from 'type-graphql'
import { z } from 'zod'
import ProficiencyModel, { Proficiency } from '@/models/2014/proficiency'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'
import ClassModel, { Class } from '@/models/2014/class'
import RaceModel, { Race } from '@/models/2014/race'
import {
  resolveMultipleReferences,
  resolveSingleReference
} from '@/graphql/2014rewrite/utils/resolvers'
import { ProficiencyReference } from '../common/unions'
import EquipmentModel from '@/models/2014/equipment'
import EquipmentCategoryModel from '@/models/2014/equipmentCategory'
import AbilityScoreModel from '@/models/2014/abilityScore'
import SkillModel from '@/models/2014/skill'
import { buildMongoSortQuery } from '@/graphql/2014rewrite/common/inputs'

export enum ProficiencyOrderField {
  NAME = 'name',
  TYPE = 'type'
}

registerEnumType(ProficiencyOrderField, {
  name: 'ProficiencyOrderField',
  description: 'Fields to sort Proficiencies by'
})

const PROFICIENCY_SORT_FIELD_MAP: Record<ProficiencyOrderField, string> = {
  [ProficiencyOrderField.NAME]: 'name',
  [ProficiencyOrderField.TYPE]: 'type'
}

const ProficiencyArgsSchema = z.object({
  name: z.string().optional(),
  class: z.array(z.string()).optional(),
  race: z.array(z.string()).optional(),
  type: z.array(z.string()).optional(),
  order_by: z.nativeEnum(ProficiencyOrderField).optional(),
  order_direction: z.nativeEnum(OrderByDirection).optional().default(OrderByDirection.ASC),
  skip: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional()
})

const ProficiencyIndexArgsSchema = z.object({
  index: z.string().min(1, { message: 'Index must be a non-empty string' })
})

// Define ArgsType for the proficiencies query
@ArgsType()
class ProficiencyArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by proficiency name (case-insensitive, partial match)'
  })
  name?: string

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by class index (e.g., ["barbarian", "bard"])'
  })
  class?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by race index (e.g., ["dragonborn", "dwarf"])'
  })
  race?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by proficiency type (exact match, e.g., ["ARMOR", "WEAPONS"])'
  })
  type?: string[]

  @Field(() => ProficiencyOrderField, {
    nullable: true,
    description: 'Field to sort proficiencies by.'
  })
  order_by?: ProficiencyOrderField

  @Field(() => OrderByDirection, {
    nullable: true,
    description: 'Sort direction for the chosen field'
  })
  order_direction?: OrderByDirection

  @Field(() => Int, { nullable: true, description: 'TODO: Pass 5 - Number of results to skip' })
  skip?: number

  @Field(() => Int, {
    nullable: true,
    description: 'TODO: Pass 5 - Maximum number of results to return'
  })
  limit?: number
}

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

    // TODO: Pass 5 - Implement pagination
    // if (validatedArgs.skip !== undefined) {
    //   query.skip(validatedArgs.skip);
    // }
    // if (validatedArgs.limit !== undefined) {
    //  query.limit(validatedArgs.limit);
    // }

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
