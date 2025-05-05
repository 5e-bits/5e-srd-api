import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { Subrace } from '@/models/2014/subrace' // Import the decorated Typegoose model
import SubraceModel from '@/models/2014/subrace' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
// Import related types if needed for FieldResolver placeholders
// import { Race } from '@/models/2014/race';
// import { Trait } from '@/models/2014/trait';
// import { Language } from '@/models/2014/language';
// import { Proficiency } from '@/models/2014/proficiency';
// import { SubraceAbilityBonus } from '@/models/2014/subrace';
// import { AbilityScore } from '@/models/2014/abilityScore';

// Define ArgsType for the subraces query
@ArgsType()
class SubraceArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by subrace name (case-insensitive, partial match)'
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
}

@Resolver(Subrace)
export class SubraceResolver {
  @Query(() => [Subrace], {
    description: 'Gets all subraces, optionally filtered by name and sorted by name.'
  })
  async subraces(@Args() { name, order_direction }: SubraceArgs): Promise<Subrace[]> {
    const query = SubraceModel.find()

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

  @Query(() => Subrace, { nullable: true, description: 'Gets a single subrace by index.' })
  async subrace(@Arg('index', () => String) index: string): Promise<Subrace | null> {
    // Note: .lean() is used, reference/choice fields will contain raw data.
    // FieldResolvers needed in Pass 2/3.
    return SubraceModel.findOne({ index }).lean()
  }

  // Field Resolvers for references (race, languages, racial_traits, starting_proficiencies, ability_bonuses.ability_score) will be added in Pass 2
  // Field Resolver for choices (language_options) will be added in Pass 3

  // Example placeholder for nested ability_score reference:
  /*
  @Resolver(SubraceAbilityBonus) // Example: Resolver for the nested type
  export class SubraceAbilityBonusResolver {
    @FieldResolver(() => AbilityScore)
    async ability_score(@Root() subraceAbilityBonus: SubraceAbilityBonus): Promise<AbilityScore | null> {
       // Fetch AbilityScore based on subraceAbilityBonus.ability_score reference
       return AbilityScoreModel.findOne({ index: subraceAbilityBonus.ability_score.index }).lean();
    }
  }
  */
}
