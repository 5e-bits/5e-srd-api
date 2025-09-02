import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { Language } from './language'
import { Proficiency } from './proficiency'
import { Subrace } from './subrace'
import { Trait } from './trait'

@ObjectType({ description: 'Ability score bonus provided by a race' })
export class RaceAbilityBonus {
  @field(() => T.Ref(AbilityScore), {
    description: 'The ability score that receives the bonus.',
    optional: true
  })
  public ability_score!: APIReference

  @field(() => T.Int, { description: 'The bonus value for the ability score' })
  public bonus!: number
}

@ObjectType({ description: 'Represents a playable race in D&D' })
@srdModelOptions('2014-races')
export class Race {
  @field(() => T.String, { description: 'The index of the race.' })
  public index!: string

  // Handled by RaceResolver
  @field(() => T.Model(Choice), { optional: true, skipResolver: true })
  public ability_bonus_options?: Choice

  @field(() => T.List(RaceAbilityBonus), {
    description: 'Ability score bonuses granted by this race.'
  })
  public ability_bonuses!: RaceAbilityBonus[]

  @field(() => T.String, { description: 'Typical age range and lifespan for the race' })
  public age!: string

  @field(() => T.String, { description: 'Typical alignment tendencies for the race' })
  public alignment!: string

  @field(() => T.String, { description: 'Description of languages typically spoken by the race' })
  public language_desc!: string

  // Handled by RaceResolver
  @field(() => T.Model(Choice), { optional: true, skipResolver: true })
  public language_options?: Choice

  @field(() => T.RefList(Language), { description: 'Languages typically spoken by this race.' })
  public languages!: APIReference[]

  @field(() => T.String, { description: 'The name of the race.' })
  public name!: string

  @field(() => T.String, { description: 'Size category (e.g., Medium, Small)' })
  public size!: string

  @field(() => T.String, { description: "Description of the race's size" })
  public size_description!: string

  @field(() => T.Int, { description: 'Base walking speed in feet' })
  public speed!: number

  @field(() => T.RefList(Proficiency), {
    description: 'Proficiencies granted by this race at start.',
    optional: true
  })
  public starting_proficiencies?: APIReference[]

  // Handled by RaceResolver
  @field(() => T.Model(Choice), { optional: true, skipResolver: true })
  public starting_proficiency_options?: Choice

  @field(() => T.RefList(Subrace), {
    description: 'Subraces available for this race.',
    optional: true
  })
  public subraces?: APIReference[]

  @field(() => T.RefList(Trait), { description: 'Traits common to this race.', optional: true })
  public traits?: APIReference[]

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type RaceDocument = DocumentType<Race>
const RaceModel = getModelForClass(Race)

export default RaceModel
