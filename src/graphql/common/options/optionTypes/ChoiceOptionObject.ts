import { ObjectType, Field } from 'type-graphql'
import { ChoiceObject } from '../../objects' // This path should now resolve via index.ts

@ObjectType({ description: 'Option presenting a further choice.' })
export class ChoiceOptionObject {
  @Field(() => String)
  readonly option_type = 'ChoiceOption' as const

  @Field(() => ChoiceObject)
  choice!: ChoiceObject
}
