import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import EquipmentModel, { Equipment, Content } from '@/models/2014/equipment'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum, IsArray } from 'class-validator'
import { escapeRegExp } from '@/util'
import WeaponPropertyModel, { WeaponProperty } from '@/models/2014/weaponProperty'
import {
  resolveMultipleReferences,
  resolveSingleReference
} from '@/graphql/2014rewrite/utils/resolvers'
import { APIReference } from '@/models/2014/types/apiReference'
import { AnyEquipment } from '@/graphql/2014rewrite/common/unions'

@ArgsType()
class EquipmentArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by equipment name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => [String], {
    nullable: true,
    description: 'Filter by one or more equipment category indices (e.g., ["weapon", "armor"])'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipment_category?: string[]

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the name field (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection

  // TODO: Pass 5 - Implement and refactor to BasePaginationArgs
  @Field(() => Number, { nullable: true, description: 'Number of results to skip for pagination' })
  @IsOptional()
  // @Min(0) // Add validation if needed
  skip?: number

  // TODO: Pass 5 - Implement and refactor to BasePaginationArgs
  @Field(() => Number, { nullable: true, description: 'Maximum number of results to return' })
  @IsOptional()
  // @Min(1) // Add validation if needed
  // @Max(100) // Add validation if needed
  limit?: number
}

@Resolver(Equipment)
export class EquipmentResolver {
  @Query(() => [AnyEquipment], {
    description: 'Gets all equipment, optionally filtered and sorted.'
  })
  async equipments(
    @Args() { name, equipment_category, order_direction }: EquipmentArgs
  ): Promise<Array<typeof AnyEquipment>> {
    const query = EquipmentModel.find()
    const filters: any[] = []

    if (name) {
      filters.push({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (equipment_category && equipment_category.length > 0) {
      filters.push({ 'equipment_category.index': { $in: equipment_category } })
    }

    if (filters.length > 0) {
      query.where({ $and: filters })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => AnyEquipment, {
    nullable: true,
    description: 'Gets a single piece of equipment by its index.'
  })
  async equipment(@Arg('index', () => String) index: string): Promise<typeof AnyEquipment | null> {
    return EquipmentModel.findOne({ index }).lean()
  }

  @FieldResolver(() => [WeaponProperty], { nullable: true })
  async properties(@Root() equipment: Equipment): Promise<WeaponProperty[] | null> {
    if (!equipment.properties) return null
    return resolveMultipleReferences(equipment.properties, WeaponPropertyModel)
  }
}
@Resolver(Content)
export class ContentFieldResolver {
  @FieldResolver(() => AnyEquipment, {
    nullable: true,
    description: 'Resolves the APIReference to the actual Equipment.'
  })
  async item(@Root() content: Content): Promise<typeof AnyEquipment | null> {
    const itemRef: APIReference = content.item

    if (!itemRef?.index) return null

    return resolveSingleReference(itemRef, EquipmentModel)
  }
}
