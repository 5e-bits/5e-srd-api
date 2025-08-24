import { getModelForClass } from '@typegoose/typegoose'
import { DocumentType } from '@typegoose/typegoose/lib/types'
import { ObjectType } from 'type-graphql'

import { field, T } from '@/util/fieldDectorator'
import { srdModelOptions } from '@/util/modelOptions'

@ObjectType({
  description: 'A school of magic, representing a particular tradition like Evocation or Illusion.'
})
@srdModelOptions('2014-magic-schools')
export class MagicSchool {
  @field(() => T.String, { description: 'A brief description of the school of magic.' })
  public desc!: string

  @field(() => T.String, {
    description: 'The unique identifier for this school (e.g., evocation).'
  })
  public index!: string

  @field(() => T.String, { description: 'The name of the school (e.g., Evocation).' })
  public name!: string

  @field(() => T.String, { description: 'The canonical path of this resource in the REST API.' })
  public url!: string

  @field(() => T.String, { description: 'Timestamp of the last update.' })
  public updated_at!: string
}

export type MagicSchoolDocument = DocumentType<MagicSchool>
const MagicSchoolModel = getModelForClass(MagicSchool)

export default MagicSchoolModel
