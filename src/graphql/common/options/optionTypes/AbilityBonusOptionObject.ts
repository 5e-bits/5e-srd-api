import { ObjectType, Field, Int } from 'type-graphql'
import { APIReferenceObject } from '../../objects' // This path should now resolve via index.ts

@ObjectType({ description: 'Option granting an ability score bonus.' })
export class AbilityBonusOptionObject {
  @Field(() => String)
  readonly option_type = 'AbilityBonusOption' as const

  @Field(() => APIReferenceObject)
  ability_score!: APIReferenceObject // Reference to AbilityScore

  @Field(() => Int)
  bonus!: number
}
