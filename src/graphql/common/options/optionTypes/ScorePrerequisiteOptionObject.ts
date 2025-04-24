import { ObjectType, Field, Int } from 'type-graphql'
import { APIReferenceObject } from '../../objects' // This path should now resolve via index.ts

@ObjectType({ description: 'Option requiring a minimum ability score.' })
export class ScorePrerequisiteOptionObject {
  @Field(() => String)
  readonly option_type = 'ScorePrerequisiteOption' as const

  @Field(() => APIReferenceObject)
  ability_score!: APIReferenceObject // Reference to AbilityScore

  @Field(() => Int)
  minimum_score!: number
}
