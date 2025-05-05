import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { Skill } from '@/models/2014/skill' // Import the decorated Typegoose model
import SkillModel from '@/models/2014/skill' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'
// Import AbilityScore if needed for the FieldResolver placeholder
// import { AbilityScore } from '@/models/2014/abilityScore';

// Define ArgsType for the skills query
@ArgsType()
class SkillArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by skill name (case-insensitive, partial match)'
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

@Resolver(Skill)
export class SkillResolver {
  @Query(() => [Skill], {
    description: 'Gets all skills, optionally filtered by name and sorted by name.'
  })
  async skills(@Args() { name, order_direction }: SkillArgs): Promise<Skill[]> {
    const query = SkillModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    // Note: .lean() is used, so the ability_score field will contain the raw APIReference data
    // A FieldResolver will be added in Pass 2 to resolve these references properly.
    return query.lean()
  }

  @Query(() => Skill, { nullable: true, description: 'Gets a single skill by index.' })
  async skill(@Arg('index', () => String) index: string): Promise<Skill | null> {
    // Note: .lean() is used, ability_score field will be raw APIReference data.
    // FieldResolver needed in Pass 2.
    return SkillModel.findOne({ index }).lean()
  }

  // Field Resolver for 'ability_score' will be added in Pass 2
  /*
  @FieldResolver(() => AbilityScore) // Assuming AbilityScore is the decorated @ObjectType
  async ability_score(@Root() skill: Skill): Promise<AbilityScore | null> {
    // Logic to fetch AbilityScore based on skill.ability_score reference
    // Example: return AbilityScoreModel.findOne({ index: skill.ability_score.index }).lean();
    return null; // Placeholder
  }
  */
}
