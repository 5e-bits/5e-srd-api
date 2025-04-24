import { ArgsType, Field } from 'type-graphql'
import { IsOptional, IsString } from 'class-validator'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'

@ArgsType()
export class SkillArgs extends NameSortArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Filter by the index of the associated ability score (e.g., str, dex).'
  })
  @IsOptional()
  @IsString()
  ability_score?: string
}
