import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { Race } from './race'
import { Trait } from './trait'

@ObjectType({ description: 'Bonus to an ability score provided by a subrace.' })
export class SubraceAbilityBonus {
  @field(T.Ref(() => AbilityScore), {
    description: 'The ability score receiving the bonus.',
    required: true,
    gql: { nullable: true }
  })
  public ability_score!: APIReference

  @field(T.Int, {
    description: 'The bonus value to the ability score.',
    required: true,
    index: true
  })
  public bonus!: number
}

@ObjectType({ description: 'A subrace representing a specific heritage within a larger race.' })
@srdModelOptions('2014-subraces')
export class Subrace {
  @field(T.List(() => SubraceAbilityBonus), {
    description: 'Ability score bonuses granted by this subrace.',
    required: true
  })
  public ability_bonuses!: SubraceAbilityBonus[]

  @field(T.String, { description: 'A description of the subrace.', required: true, index: true })
  public desc!: string

  @field(T.String, {
    description: 'The unique identifier for this subrace (e.g., high-elf).',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, {
    description: 'The name of the subrace (e.g., High Elf).',
    required: true,
    index: true
  })
  public name!: string

  @field(T.Ref(() => Race), {
    description: 'The parent race for this subrace.',
    required: true,
    gql: { nullable: true }
  })
  public race!: APIReference

  @field(T.RefList(() => Trait), {
    description: 'Racial traits associated with this subrace.',
    gql: { nullable: true }
  })
  public racial_traits!: APIReference[]

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type SubraceDocument = DocumentType<Subrace>
const SubraceModel = getModelForClass(Subrace)

export default SubraceModel
