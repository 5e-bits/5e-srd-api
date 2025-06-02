import { getModelForClass, prop } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { Field, Int, ObjectType } from 'type-graphql'

import { LanguageChoice } from '@/graphql/2014/common/choiceTypes'
import { APIReference } from '@/models/2014/common/apiReference'
import { Choice } from '@/models/2014/common/choice'
import { srdModelOptions } from '@/util/modelOptions'

import { AbilityScore } from './abilityScore'
import { Language } from './language'
import { Proficiency } from './proficiency'
import { Race } from './race'
import { Trait } from './trait'

@ObjectType({ description: 'Bonus to an ability score provided by a subrace.' })
export class SubraceAbilityBonus {
  @Field(() => AbilityScore, {
    nullable: true,
    description: 'The ability score receiving the bonus.'
  })
  @prop({ type: () => APIReference, required: true })
  public ability_score!: APIReference

  @Field(() => Int, { description: 'The bonus value to the ability score.' })
  @prop({ required: true, index: true, type: () => Number })
  public bonus!: number
}

@ObjectType({ description: 'A subrace representing a specific heritage within a larger race.' })
@srdModelOptions('2014-subraces')
export class Subrace {
  @Field(() => [SubraceAbilityBonus], {
    description: 'Ability score bonuses granted by this subrace.'
  })
  @prop({ type: () => [SubraceAbilityBonus], required: true })
  public ability_bonuses!: SubraceAbilityBonus[]

  @Field(() => String, { description: 'A description of the subrace.' })
  @prop({ required: true, index: true, type: () => String })
  public desc!: string

  @Field(() => String, { description: 'The unique identifier for this subrace (e.g., high-elf).' })
  @prop({ required: true, index: true, type: () => String })
  public index!: string

  @Field(() => [Language], {
    nullable: true,
    description: 'Additional languages granted by this subrace.'
  })
  @prop({ type: () => [APIReference] })
  public languages?: APIReference[]

  @Field(() => LanguageChoice, {
    nullable: true,
    description: 'Languages typically spoken by this subrace.'
  })
  @prop({ type: () => Choice })
  public language_options?: Choice

  @Field(() => String, { description: 'The name of the subrace (e.g., High Elf).' })
  @prop({ required: true, index: true, type: () => String })
  public name!: string

  @Field(() => Race, { nullable: true, description: 'The parent race for this subrace.' })
  @prop({ type: () => APIReference, required: true })
  public race!: APIReference

  @Field(() => [Trait], {
    nullable: true,
    description: 'Racial traits associated with this subrace.'
  })
  @prop({ type: () => [APIReference] })
  public racial_traits!: APIReference[]

  @Field(() => [Proficiency], {
    nullable: true,
    description: 'Proficiencies granted by this subrace.'
  })
  @prop({ type: () => [APIReference] })
  public starting_proficiencies?: APIReference[]

  @prop({ required: true, index: true, type: () => String })
  public url!: string

  @Field(() => String, { description: 'Timestamp of the last update.' })
  @prop({ required: true, index: true, type: () => String })
  public updated_at!: string
}

export type SubraceDocument = DocumentType<Subrace>
const SubraceModel = getModelForClass(Subrace)

export default SubraceModel
