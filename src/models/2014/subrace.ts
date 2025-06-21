import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { LanguageChoice } from '@/graphql/2014/common/choiceTypes'
import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { Language } from './language'
import { Proficiency } from './proficiency'
import { Race } from './race'
import { Trait } from './trait'

@ObjectType({ description: 'Bonus to an ability score provided by a subrace.' })
export class SubraceAbilityBonus {
  @field(() => T.Ref(AbilityScore), { description: 'The ability score receiving the bonus.' })
  public ability_score!: APIReference

  @field(() => T.Int, { description: 'The bonus value to the ability score.' })
  public bonus!: number
}

@ObjectType({ description: 'A subrace representing a specific heritage within a larger race.' })
@srdModelOptions('2014-subraces')
export class Subrace {
  @field(() => T.List(SubraceAbilityBonus), {
    description: 'Ability score bonuses granted by this subrace.'
  })
  public ability_bonuses!: SubraceAbilityBonus[]

  @field(() => T.String, { description: 'A description of the subrace.' })
  public desc!: string

  @field(() => T.String, {
    description: 'The unique identifier for this subrace (e.g., high-elf).'
  })
  public index!: string

  @field(() => T.RefList(Language), {
    description: 'Additional languages granted by this subrace.',
    optional: true
  })
  public languages?: APIReference[]

  @field(() => T.Model(LanguageChoice), {
    description: 'Languages typically spoken by this subrace.',
    optional: true
  })
  public language_options?: Choice

  @field(() => T.String, { description: 'The name of the subrace (e.g., High Elf).' })
  public name!: string

  @field(() => T.Ref(Race), { description: 'The parent race for this subrace.', optional: true })
  public race!: APIReference

  @field(() => T.RefList(Trait), { description: 'Racial traits associated with this subrace.' })
  public racial_traits!: APIReference[]

  @field(() => T.RefList(Proficiency), {
    description: 'Proficiencies granted by this subrace.',
    optional: true
  })
  public starting_proficiencies?: APIReference[]

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type SubraceDocument = DocumentType<Subrace>
const SubraceModel = getModelForClass(Subrace)

export default SubraceModel
