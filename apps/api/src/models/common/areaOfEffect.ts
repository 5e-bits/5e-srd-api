import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/field'

@ObjectType({ description: 'Defines an area of effect for spells or abilities.' })
export class AreaOfEffect {
  @field(T.Int, {
    description: 'The size of the area of effect (e.g., radius in feet).',
    required: true
  })
  public size!: number

  @field(T.String, { description: 'The shape of the area of effect.', required: true, index: true })
  public type!: 'sphere' | 'cube' | 'cylinder' | 'line' | 'cone'
}
