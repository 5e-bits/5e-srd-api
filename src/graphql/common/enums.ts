import { registerEnumType } from 'type-graphql'

export enum OrderByDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

registerEnumType(OrderByDirection, {
  name: 'OrderByDirection',
  description: 'Specifies the direction for ordering results.'
})
