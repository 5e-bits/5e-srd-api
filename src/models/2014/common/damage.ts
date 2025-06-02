import { prop } from '@typegoose/typegoose'
import { Field, ObjectType } from 'type-graphql'

import { APIReference } from '@/models/2014/common/apiReference'
import { DamageType } from '@/models/2014/damageType'

@ObjectType({ description: 'Represents damage dealt by an ability, spell, or weapon.' })
export class Damage {
  @Field(() => DamageType, { nullable: true, description: 'The type of damage.' })
  @prop({ type: () => APIReference })
  public damage_type!: APIReference // This should reference DamageType, not any APIReference

  @Field(() => String, { description: 'The damage dice roll (e.g., 3d6).' })
  @prop({ required: true, index: true, type: () => String })
  public damage_dice!: string
}
