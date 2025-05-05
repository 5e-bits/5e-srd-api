import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { Trait } from '@/models/2014/trait' // Import the decorated Typegoose model
import TraitModel from '@/models/2014/trait' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
// Import related types if needed for FieldResolver placeholders
// import { Race } from '@/models/2014/race';
// import { Subrace } from '@/models/2014/subrace';
// import { Proficiency } from '@/models/2014/proficiency';
// import { Language } from '@/models/2014/language';

// Define ArgsType for the traits query
@ArgsType()
class TraitArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by trait name (case-insensitive, partial match)'
  })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => OrderByDirection, {
    nullable: true,
    defaultValue: OrderByDirection.ASC,
    description: 'Sort direction (default: ASC)'
  })
  @IsOptional()
  @IsEnum(OrderByDirection)
  order_direction?: OrderByDirection

  // Note: Sorting is hardcoded by 'name'
}

@Resolver(Trait)
export class TraitResolver {
  @Query(() => [Trait], {
    description: 'Gets all traits, optionally filtered by name and sorted by name.'
  })
  async traits(@Args() { name, order_direction }: TraitArgs): Promise<Trait[]> {
    const query = TraitModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    // Note: .lean() is used, so reference/choice fields will contain raw data
    // FieldResolvers will be added in Pass 2/3.
    return query.lean()
  }

  @Query(() => Trait, { nullable: true, description: 'Gets a single trait by index.' })
  async trait(@Arg('index', () => String) index: string): Promise<Trait | null> {
    // Note: .lean() is used, reference/choice fields will contain raw data.
    // FieldResolvers needed in Pass 2/3.
    return TraitModel.findOne({ index }).lean()
  }

  // Field Resolvers for references (races, subraces, parent, proficiencies->proficiency) will be added in Pass 2
  // Field Resolvers for choices (proficiency_choices, language_options) will be added in Pass 3
  // Field Resolver for trait_specific and its contents will be added in Pass 2/3
}
