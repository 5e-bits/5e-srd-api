import { ObjectType } from 'type-graphql'

import { DamageType } from '@/models/2014/damageType'
import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'

@ObjectType({ description: 'Represents damage dealt by an ability, spell, or weapon.' })
export class Damage {
  @field(T.Ref(() => DamageType), { description: 'The type of damage.', gql: { nullable: true } })
  public damage_type!: APIReference // This should reference DamageType, not any APIReference

  @field(T.String, {
    description: 'The damage dice roll (e.g., 3d6).',
    required: true,
    index: true
  })
  public damage_dice!: string
}
