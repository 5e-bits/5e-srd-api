import { Resolver, Query, Arg, Args, ArgsType, Field, FieldResolver, Root } from 'type-graphql'
import EquipmentModel, { Equipment, Content } from '@/models/2014/equipment'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
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

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction for the name field (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection
}

@Resolver(Equipment)
export class EquipmentResolver {
  @Query(() => [Equipment], {
    description: 'Gets all equipment, optionally filtered and sorted.'
  })
  async equipments(@Args() { name, order_direction }: EquipmentArgs): Promise<Equipment[]> {
    const query = EquipmentModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    // Note: .lean() is used, so reference fields will contain raw data
    // FieldResolvers will be added in Pass 2.
    return query.lean()
  }

  @Query(() => Equipment, {
    nullable: true,
    description: 'Gets a single piece of equipment by its index.'
  })
  async equipment(@Arg('index', () => String) index: string): Promise<Equipment | null> {
    return EquipmentModel.findOne({ index }).lean()
  }

  // --- Pass 2 Field Resolver ---
  @FieldResolver(() => [WeaponProperty], { nullable: true })
  async properties(@Root() equipment: Equipment): Promise<WeaponProperty[] | null> {
    if (!equipment.properties) return null
    return resolveMultipleReferences(equipment.properties, WeaponPropertyModel)
  }

  // Resolvers for equipment_category, gear_category, armor_class, contents, damage, two_handed_damage deferred to Intermediate Step
}

// --- Resolver for nested Content type ---
@Resolver(Content)
export class ContentFieldResolver {
  @FieldResolver(() => AnyEquipment, {
    nullable: true,
    description: 'Resolves the APIReference to the actual Equipment.'
  })
  async item(@Root() content: Content): Promise<Equipment | null> {
    const itemRef: APIReference = content.item

    if (!itemRef?.index) return null

    return resolveSingleReference(itemRef, EquipmentModel)
  }
}
