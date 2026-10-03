import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { Language } from './language'
import { Subrace } from './subrace'
import { Trait } from './trait'

@ObjectType({ description: 'Ability score bonus provided by a race' })
export class RaceAbilityBonus {
  @field(T.Ref(() => AbilityScore), {
    description: 'The ability score that receives the bonus.',
    required: true,
    gql: { nullable: true }
  })
  public ability_score!: APIReference

  @field(T.Int, {
    description: 'The bonus value for the ability score',
    required: true,
    index: true
  })
  public bonus!: number
}

@ObjectType({ description: 'Represents a playable race in D&D' })
@srdModelOptions('2014-races')
export class Race {
  @field(T.String, { description: 'The index of the race.', required: true, index: true })
  public index!: string

  // Handled by RaceResolver
  @field(T.Model(() => Choice), { required: false, index: true, gql: false })
  public ability_bonus_options?: Choice

  @field(T.List(() => RaceAbilityBonus), {
    description: 'Ability score bonuses granted by this race.',
    required: true
  })
  public ability_bonuses!: RaceAbilityBonus[]

  @field(T.String, {
    description: 'Typical age range and lifespan for the race',
    required: true,
    index: true
  })
  public age!: string

  @field(T.String, {
    description: 'Typical alignment tendencies for the race',
    required: true,
    index: true
  })
  public alignment!: string

  @field(T.String, {
    description: 'Description of languages typically spoken by the race',
    required: true,
    index: true
  })
  public language_desc!: string

  // Handled by RaceResolver
  @field(T.Model(() => Choice), { gql: false })
  public language_options?: Choice

  @field(T.RefList(() => Language), {
    description: 'Languages typically spoken by this race.',
    required: true,
    gql: { nullable: true }
  })
  public languages!: APIReference[]

  @field(T.String, { description: 'The name of the race.', required: true, index: true })
  public name!: string

  @field(T.String, {
    description: 'Size category (e.g., Medium, Small)',
    required: true,
    index: true
  })
  public size!: string

  @field(T.String, { description: "Description of the race's size", required: true, index: true })
  public size_description!: string

  @field(T.Int, { description: 'Base walking speed in feet', required: true, index: true })
  public speed!: number

  @field(T.RefList(() => Subrace), {
    description: 'Subraces available for this race.',
    gql: { nullable: true }
  })
  public subraces?: APIReference[]

  @field(T.RefList(() => Trait), {
    description: 'Traits common to this race.',
    gql: { nullable: true }
  })
  public traits?: APIReference[]

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update', required: true, index: true })
  public updated_at!: string
}

export type RaceDocument = DocumentType<Race>
const RaceModel = getModelForClass(Race)

export default RaceModel
