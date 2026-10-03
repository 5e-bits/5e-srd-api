import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'

@ObjectType({ description: 'A prerequisite for taking a feat, usually a minimum ability score.' })
export class Prerequisite {
  @field(T.Ref(() => AbilityScore), {
    description: 'The ability score required for this prerequisite.',
    gql: { nullable: true }
  })
  public ability_score!: APIReference

  @field(T.Int, {
    description: 'The minimum score required in the referenced ability score.',
    required: true,
    index: true
  })
  public minimum_score!: number
}

@ObjectType({
  description: 'A feat representing a special talent or expertise giving unique capabilities.'
})
@srdModelOptions('2014-feats')
export class Feat {
  @field(T.String, {
    description: 'The unique identifier for this feat (e.g., grappler).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the feat (e.g., Grappler).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.List(() => Prerequisite), {
    description: 'Prerequisites that must be met to take the feat.'
  })
  public prerequisites!: Prerequisite[]

  @field(T.List(T.String), {
    description: 'A description of the benefits conferred by the feat.',
    required: true,
    index: true
  })
  public desc!: string[]

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type FeatDocument = DocumentType<Feat>
const FeatModel = getModelForClass(Feat)

export default FeatModel
