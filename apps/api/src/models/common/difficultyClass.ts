import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field' // Path to AbilityScore model

import { APIReference } from './apiReference' // Assuming apiReference.ts is in the same directory
import { AbilityScore } from '../2014/abilityScore'

@ObjectType({
  description:
    'Represents a Difficulty Class (DC) for saving throws or ability checks where a value is expected.'
})
export class DifficultyClass {
  @field(T.Ref(() => AbilityScore), { description: 'The ability score associated with this DC.' })
  public dc_type!: APIReference

  @field(T.Int, {
    description: 'The value of the DC.',
    required: false,
    index: true,
    gql: { nullable: true }
  })
  public dc_value?: number

  @field(T.String, {
    description: 'The result of a successful save against this DC.',
    required: true,
    index: true
  })
  public success_type!: 'none' | 'half' | 'other'
}
