import { ObjectType, Field } from 'type-graphql'
import { APIReferenceObject } from '../../objects' // This path should now resolve via index.ts

@ObjectType({ description: 'Option representing an ideal with alignment references.' })
export class IdealOptionObject {
  @Field(() => String)
  readonly option_type = 'IdealOption' as const

  @Field(() => String)
  desc!: string

  @Field(() => [APIReferenceObject])
  alignments!: APIReferenceObject[] // Reference to Alignment
}
