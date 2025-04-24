import { ObjectType, Field, Int } from 'type-graphql'
import { APIReferenceObject } from '../../objects' // This path should now resolve via index.ts

// Re-define PrerequisiteObject here as it's specific to CountedReferenceOption
@ObjectType({ description: 'Prerequisite for a counted reference option.' })
class PrerequisiteObject {
  @Field(() => String)
  readonly type = 'proficiency' as const

  @Field(() => APIReferenceObject, { nullable: true })
  proficiency?: APIReferenceObject // Reference to a proficiency
}

@ObjectType({ description: 'Option referencing a resource with a specific count.' })
export class CountedReferenceOptionObject {
  @Field(() => String)
  readonly option_type = 'CountedReferenceOption' as const

  @Field(() => Int)
  count!: number

  @Field(() => APIReferenceObject)
  of!: APIReferenceObject

  @Field(() => [PrerequisiteObject], { nullable: true })
  prerequisites?: PrerequisiteObject[]
}
