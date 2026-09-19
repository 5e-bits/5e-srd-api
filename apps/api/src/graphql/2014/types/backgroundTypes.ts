import { Field, Int, ObjectType } from 'type-graphql'

import { Alignment } from '@/models/2014/alignment'

// --- Background Ideal Choice Types ---
@ObjectType({ description: 'Represents a single ideal option for a background.' })
export class IdealOption {
  @Field(() => String, { description: 'The type of the ideal option (e.g., ideal).' })
  option_type!: string

  @Field(() => String, { description: 'The description of the ideal.' })
  desc!: string

  @Field(() => [Alignment], { description: 'Alignments associated with this ideal.' })
  alignments!: Alignment[]
}

@ObjectType({ description: 'Represents a set of ideal options for a background.' })
export class IdealOptionSet {
  @Field(() => String, { description: 'The type of the ideal option set (e.g., options_array).' })
  option_set_type!: string

  @Field(() => [IdealOption], { description: 'The list of ideal options available.' })
  options!: IdealOption[]
}

@ObjectType({ description: 'Represents the choice structure for background ideals.' })
export class IdealChoice {
  @Field(() => Int, { description: 'The number of ideals to choose from this list.' })
  choose!: number

  @Field(() => String, { description: 'The type of choice (e.g., ideals).' })
  type!: string

  @Field(() => IdealOptionSet, { description: 'The set of ideal options available.' })
  from!: IdealOptionSet
}
