import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { AbilityScore2024 } from '@/models/2024/abilityScore'
import { Proficiency2024 } from '@/models/2024/proficiency'
import { Subclass2024 } from '@/models/2024/subclass'
import { APIReference } from '@/models/common/apiReference'
import { Choice } from '@/models/common/choice'
import { field, T } from '@/util/field'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({ description: 'A spellcasting info entry for a 2024 class.' })
export class SpellcastingInfo2024 {
  @field(T.String, { description: 'The name of the spellcasting info entry.', required: true })
  public name!: string

  @field(T.List(T.String), {
    description: 'Description of the spellcasting info entry.',
    required: true
  })
  public desc!: string[]
}

@ObjectType({ description: 'Spellcasting details for a 2024 class.' })
export class Spellcasting2024 {
  @field(T.Int, { description: 'The level at which spellcasting begins.', required: true })
  public level!: number

  @field(T.Ref(() => AbilityScore2024), {
    description: 'The ability score used for spellcasting.',
    required: true
  })
  public spellcasting_ability!: APIReference

  @field(T.List(() => SpellcastingInfo2024), {
    description: 'Additional spellcasting info entries.',
    required: true
  })
  public info!: SpellcastingInfo2024[]
}

@ObjectType({ description: 'A prerequisite for multi-classing into a 2024 class.' })
export class MultiClassingPrereq2024 {
  @field(T.Ref(() => AbilityScore2024), {
    description: 'The ability score required.',
    gql: { nullable: true }
  })
  public ability_score?: APIReference

  @field(T.Int, { description: 'The minimum score required.', required: true })
  public minimum_score!: number
}

@ObjectType({ description: 'Multi-classing requirements and proficiencies for a 2024 class.' })
export class MultiClassing2024 {
  @field(T.List(() => MultiClassingPrereq2024), {
    description: 'Ability score prerequisites for multi-classing.',
    gql: { nullable: true }
  })
  public prerequisites?: MultiClassingPrereq2024[]

  @field(T.Model(() => Choice), { gql: false })
  public prerequisite_options?: Choice

  @field(T.RefList(() => Proficiency2024), {
    description: 'Proficiencies gained when multi-classing.',
    gql: { nullable: true }
  })
  public proficiencies?: APIReference[]

  @field(T.List(() => Choice), { gql: false })
  public proficiency_choices?: Choice[]
}

@ObjectType({ description: 'The primary ability information for a 2024 class.' })
export class PrimaryAbility2024 {
  @field(T.String, { description: 'Description of the primary ability.', required: true })
  public desc!: string

  @field(T.RefList(() => AbilityScore2024), {
    description: 'All of these ability scores must meet the minimum.',
    gql: { nullable: true }
  })
  public ability_scores?: APIReference[]

  @field(T.Model(() => Choice), { gql: false })
  public ability_score_options?: Choice
}

@ObjectType({ description: 'A character class in D&D 5e 2024.' })
@srdModelOptions('2024-classes')
export class Class2024 {
  @field(T.String, {
    description: 'The unique identifier for this class.',
    required: true,
    index: true
  })
  public index!: string

  @field(T.String, { description: 'The name of the class.', required: true, index: true })
  public name!: string

  @field(T.Model(() => PrimaryAbility2024), {
    description: 'The primary ability for this class.',
    required: true
  })
  public primary_ability!: PrimaryAbility2024

  @field(T.Int, {
    description: 'The hit die size for this class (e.g., 6, 8, 10, 12).',
    required: true
  })
  public hit_die!: number

  @field(T.String, { description: 'URL path to the class levels resource.', required: true })
  public class_levels!: string

  @field(T.Model(() => MultiClassing2024), {
    description: 'Multi-classing requirements.',
    gql: { nullable: true }
  })
  public multi_classing?: MultiClassing2024

  @field(T.RefList(() => Proficiency2024), {
    description: 'Base proficiencies granted by this class.',
    gql: { nullable: true }
  })
  public proficiencies?: APIReference[]

  @field(T.List(() => Choice), { required: true, gql: false })
  public proficiency_choices!: Choice[]

  @field(T.RefList(() => AbilityScore2024), {
    description: 'Saving throw proficiencies granted by this class.',
    gql: { nullable: true }
  })
  public saving_throws?: APIReference[]

  @field(T.List(() => Choice), { required: true, gql: false })
  public starting_equipment_options!: Choice[]

  @field(T.RefList(() => Subclass2024), {
    description: 'Available subclasses.',
    gql: { nullable: true }
  })
  public subclasses?: APIReference[]

  @field(T.Model(() => Spellcasting2024), {
    description: 'Spellcasting details.',
    gql: { nullable: true }
  })
  public spellcasting?: Spellcasting2024

  @field(T.String, {
    description: 'URL path to the class spells resource.',
    gql: { nullable: true }
  })
  public spells?: string

  @field(T.String, { required: true, index: true, gql: false })
  public url!: string

  @field(T.String, { description: 'Timestamp of the last update.', required: true, index: true })
  public updated_at!: string
}

export type ClassDocument = DocumentType<Class2024>
const ClassModel = getModelForClass(Class2024)

export default ClassModel
