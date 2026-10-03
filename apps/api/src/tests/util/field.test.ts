import { buildSchema, prop } from '@typegoose/typegoose'
import { Field, getMetadataStorage, ObjectType } from 'type-graphql'
import { describe, expect, it } from 'vitest'

import { APIReference } from '@/models/common/apiReference'
import { field, T } from '@/util/field'

@ObjectType()
class Old {
  @Field(() => [String], { description: 'd' })
  @prop({ required: true, index: true, type: () => [String] })
  public a!: string[]

  @Field(() => [APIReference], { description: 'r', nullable: true })
  @prop({ type: () => [APIReference] })
  public b?: APIReference[]

  @prop({ required: true, type: () => String })
  public hidden!: string
}

@ObjectType()
class New {
  @field(() => T.List(String), { description: 'd', required: true, index: true })
  public a!: string[]

  @field(() => T.RefList(APIReference), { description: 'r', gql: { nullable: true } })
  public b?: APIReference[]

  @field(() => T.String, { required: true })
  public hidden!: string
}

const paths = (cls: object) =>
  Object.entries(buildSchema(cls as never).paths).map(([k, v]) => [
    k,
    v.instance,
    v.options.required,
    v.options.index
  ])

const gqlFields = (name: string) =>
  getMetadataStorage()
    .fields.filter((f) => f.target.name === name)
    .map((f) => [f.name, f.description, f.typeOptions, f.getType()])

describe('field', () => {
  it('builds the same Mongoose schema as @prop', () => {
    expect(paths(New)).toEqual(paths(Old))
  })

  it('exposes the same GraphQL fields as @Field, skipping those without a description', () => {
    expect(gqlFields('New').map(([n]) => n)).toEqual(['a', 'b'])
    expect(gqlFields('New')).toEqual(gqlFields('Old'))
  })
})
