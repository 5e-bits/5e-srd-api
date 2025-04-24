import { ArgsType, Field } from 'type-graphql'
import { IsOptional, IsString } from 'class-validator'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'

@ArgsType()
export class AbilityScoreArgs extends NameSortArgs {
  @Field(() => String, {
    nullable: true,
    description:
      'Filter by the full name of the ability score (e.g., Strength, Dexterity). Case-insensitive match.'
  })
  @IsOptional()
  @IsString()
  full_name?: string
}
