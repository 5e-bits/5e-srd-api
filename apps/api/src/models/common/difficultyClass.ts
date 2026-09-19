import { prop } from '@typegoose/typegoose'
import { Field, Int, ObjectType } from 'type-graphql'

import { APIReference } from './apiReference' // Assuming apiReference.ts is in the same directory
import { AbilityScore } from '../2014/abilityScore' // Path to AbilityScore model

@ObjectType({
  description:
    'Represents a Difficulty Class (DC) for saving throws or ability checks where a value is expected.'
})
export class DifficultyClass {
  @Field(() => AbilityScore, { description: 'The ability score associated with this DC.' })
  @prop({ type: () => APIReference })
  public dc_type!: APIReference

  @Field(() => Int, { description: 'The value of the DC.' })
  @prop({ required: true, index: true, type: () => Number })
  public dc_value!: number

  @Field(() => String, { description: 'The result of a successful save against this DC.' })
  @prop({ required: true, index: true, type: () => String })
  public success_type!: 'none' | 'half' | 'other'
}
