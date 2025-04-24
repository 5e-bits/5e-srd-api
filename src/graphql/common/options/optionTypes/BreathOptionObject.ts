import { ObjectType, Field } from 'type-graphql'
import { DifficultyClassObject, DamageObject } from '../../objects' // This path should now resolve via index.ts

@ObjectType({ description: 'Option representing a breath weapon.' })
export class BreathOptionObject {
  @Field(() => String)
  readonly option_type = 'BreathOption' as const

  @Field(() => String)
  name!: string

  @Field(() => DifficultyClassObject)
  dc!: DifficultyClassObject

  @Field(() => [DamageObject], { nullable: true })
  damage?: DamageObject[]
}
