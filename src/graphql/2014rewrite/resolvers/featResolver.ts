import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { Feat } from '@/models/2014/feat' // Import the decorated Typegoose model
import FeatModel from '@/models/2014/feat' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
// Import Prerequisite if needed for FieldResolver placeholder
// import { Prerequisite } from '@/models/2014/feat';
// import { AbilityScore } from '@/models/2014/abilityScore';

// Define ArgsType for the feats query
@ArgsType()
class FeatArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by feat name (case-insensitive, partial match)'
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

@Resolver(Feat)
export class FeatResolver {
  @Query(() => [Feat], {
    description: 'Gets all feats, optionally filtered by name and sorted by name.'
  })
  async feats(@Args() { name, order_direction }: FeatArgs): Promise<Feat[]> {
    const query = FeatModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
    query.sort({ name: sortOrder })

    // Note: .lean() is used, so prerequisite ability_score will be raw APIReference data
    // A FieldResolver will be added in Pass 2.
    return query.lean()
  }

  @Query(() => Feat, { nullable: true, description: 'Gets a single feat by index.' })
  async feat(@Arg('index', () => String) index: string): Promise<Feat | null> {
    // Note: .lean() is used, prerequisite ability_score will be raw APIReference data.
    // FieldResolver needed in Pass 2.
    return FeatModel.findOne({ index }).lean()
  }

  // Field Resolver for prerequisites.ability_score would conceptually go here in Pass 2,
  // likely by adding a resolver for the Prerequisite type or handling it within the Feat resolver.
  /*
  @Resolver(Prerequisite) // Example: Resolver for the nested type
  export class PrerequisiteResolver {
    @FieldResolver(() => AbilityScore)
    async ability_score(@Root() prerequisite: Prerequisite): Promise<AbilityScore | null> {
       // Fetch AbilityScore based on prerequisite.ability_score reference
       return AbilityScoreModel.findOne({ index: prerequisite.ability_score.index }).lean();
    }
  }
  */
}
