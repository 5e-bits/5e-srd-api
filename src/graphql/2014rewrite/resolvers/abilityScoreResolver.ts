import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { AbilityScore } from '@/models/2014/abilityScore' // Import the decorated Typegoose model
import AbilityScoreModel from '@/models/2014/abilityScore' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'

// Define ArgsType for the abilityScores query
@ArgsType()
class AbilityScoreArgs {
  @Field(() => String, {
    nullable: true,
    description:
      'Filter by ability score name (case-insensitive, partial match, checks both name and full_name)'
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

@Resolver(AbilityScore)
export class AbilityScoreResolver {
  @Query(() => [AbilityScore], {
    description: 'Gets all ability scores, optionally filtered by name and sorted by name.'
  })
  async abilityScores(
    @Args() { name, order_direction }: AbilityScoreArgs
  ): Promise<AbilityScore[]> {
    const query = AbilityScoreModel.find()

    if (name) {
      // Use escaped regex for case-insensitive partial match
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
      const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
      query.sort({ name: sortOrder })
    }

    // Note: .lean() is used, so the skills field will contain the raw APIReference data
    // A FieldResolver will be added in Pass 2 to resolve these references properly.
    return query.lean()
  }

  @Query(() => AbilityScore, {
    nullable: true,
    description: 'Gets a single ability score by index.'
  })
  async abilityScore(@Arg('index', () => String) index: string): Promise<AbilityScore | null> {
    // Note: .lean() is used, skills field will be raw APIReference data.
    // FieldResolver needed in Pass 2.
    return AbilityScoreModel.findOne({ index }).lean()
  }

  // Field Resolver for 'skills' will be added in Pass 2
  /*
  @FieldResolver(() => [Skill]) // Assuming Skill is another @ObjectType
  async skills(@Root() abilityScore: AbilityScore): Promise<Skill[]> {
    // Logic to fetch Skills based on abilityScore.skills references
    return []; // Placeholder
  }
  */
}
