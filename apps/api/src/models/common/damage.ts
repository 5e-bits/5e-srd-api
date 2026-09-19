import { prop } from '@typegoose/typegoose'
import { Field, ObjectType } from 'type-graphql'

import { DamageType } from '@/models/2014/damageType'
import { APIReference } from '@/models/common/apiReference'

@ObjectType({ description: 'Represents damage dealt by an ability, spell, or weapon.' })
export class Damage {
  @Field(() => DamageType, { nullable: true, description: 'The type of damage.' })
  @prop({ type: () => APIReference })
  public damage_type!: APIReference // This should reference DamageType, not any APIReference

  @Field(() => String, { description: 'The damage dice roll (e.g., 3d6).' })
  @prop({ required: true, index: true, type: () => String })
  public damage_dice!: string
}
