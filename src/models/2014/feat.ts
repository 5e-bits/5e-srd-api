import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'

@ObjectType({ description: 'A prerequisite for taking a feat, usually a minimum ability score.' })
export class Prerequisite {
  @field(() => T.Ref(AbilityScore), {
    description: 'The ability score required for this prerequisite.',
    optional: true
  })
  public ability_score!: APIReference

  @field(() => T.Int, {
    description: 'The minimum score required in the referenced ability score.'
  })
  public minimum_score!: number
}

@ObjectType({
  description: 'A feat representing a special talent or expertise giving unique capabilities.'
})
@srdModelOptions('2014-feats')
export class Feat {
  @field(() => T.String, { description: 'The unique identifier for this feat (e.g., grappler).' })
  public index!: string

  @field(() => T.String, { description: 'The name of the feat (e.g., Grappler).' })
  public name!: string

  @field(() => T.List(Prerequisite), {
    description: 'Prerequisites that must be met to take the feat.'
  })
  public prerequisites!: Prerequisite[]

  @field(() => T.List(String), {
    description: 'A description of the benefits conferred by the feat.'
  })
  public desc!: string[]

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type FeatDocument = DocumentType<Feat>
const FeatModel = getModelForClass(Feat)

export default FeatModel
