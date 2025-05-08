import { Resolver, Query, Arg, Args, ArgsType, Field } from 'type-graphql'
import LanguageModel, { Language } from '@/models/2014/language'
import { OrderByDirection } from '@/graphql/2014rewrite/common/enums'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { escapeRegExp } from '@/util'

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

    if (order_direction) {
      query.sort({ name: order_direction === OrderByDirection.DESC ? -1 : 1 })
    }

    return query.lean()
  }

  @Query(() => Language, { nullable: true, description: 'Gets a single language by index.' })
  async language(@Arg('index', () => String) index: string): Promise<Language | null> {
    return LanguageModel.findOne({ index }).lean()
  }
}
