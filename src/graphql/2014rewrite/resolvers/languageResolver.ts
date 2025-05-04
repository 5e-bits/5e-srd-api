import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import { Language } from '@/models/2014/language' // Import the decorated Typegoose model
import LanguageModel from '@/models/2014/language' // Import the default export for data access
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums' // Import shared enum
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'

// Define ArgsType for the languages query
@ArgsType()
class LanguageArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by language name (case-insensitive, partial match)'
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

@Resolver(Language)
export class LanguageResolver {
  @Query(() => [Language], {
    description: 'Gets all languages, optionally filtered by name and sorted by name.'
  })
  async languages(@Args() { name, order_direction }: LanguageArgs): Promise<Language[]> {
    const query = LanguageModel.find()

    if (name) {
      query.where({ name: { $regex: new RegExp(escapeRegExp(name), 'i') } })
    }

    const sortOrder = order_direction === OrderByDirection.DESC ? -1 : 1
    query.sort({ name: sortOrder })

    return query.lean()
  }

  @Query(() => Language, { nullable: true, description: 'Gets a single language by index.' })
  async language(@Arg('index', () => String) index: string): Promise<Language | null> {
    return LanguageModel.findOne({ index }).lean()
  }
}
