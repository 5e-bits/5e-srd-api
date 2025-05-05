import { Resolver, Query, Arg, Args, ArgsType, Field, Int } from 'type-graphql'
import { IsOptional, IsString, IsEnum, IsInt } from 'class-validator'
import ClassModel, { Class } from '@/models/2014/class'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { escapeRegExp } from '@/util'

@ArgsType()
class ClassArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by class name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => Int, { nullable: true, description: 'Filter by hit die size' })
  @IsOptional()
  @IsInt()
  hit_die?: number

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

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
      const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
      query.sort({ name: sortOrder })
    }

    if (hit_die) {
      query.where({ hit_die })
    }

    return query.lean()
  }

  @Query(() => Class, { nullable: true, description: 'Gets a single class by its index.' })
  async class(@Arg('index', () => String) index: string): Promise<Class | null> {
    return ClassModel.findOne({ index }).lean()
  }

  // TODO: Pass 2 - Field resolvers for references (class_levels, proficiencies, saving_throws, spells, subclasses)
  // TODO: Pass 2/3 - Field resolvers for complex types (multi_classing, spellcasting, starting_equipment)
  // TODO: Pass 3 - Field resolvers for choices (proficiency_choices, starting_equipment_options)
}
