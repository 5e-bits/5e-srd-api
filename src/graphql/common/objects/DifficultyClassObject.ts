import { ObjectType, Field, Int } from 'type-graphql'
import { APIReferenceObject } from './APIReferenceObject'

@ObjectType({ description: 'Represents a Difficulty Class (DC).' })
export class DifficultyClassObject {
  @Field(() => APIReferenceObject, { description: 'The ability score defining the DC.' })
  dc_type!: APIReferenceObject // References AbilityScore

  @Field(() => Int, { description: 'The DC value.' })
  dc_value!: number

  @Field(() => String, { description: 'Type of success required (e.g., none, half).' })
  success_type!: 'none' | 'half' | 'other'
}
