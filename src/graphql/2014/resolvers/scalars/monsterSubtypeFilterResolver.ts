import { createEnumScalarType } from './enumFilterResolver'

const subtypes = [
  'ANY_RACE',
  'HUMAN',
  'DWARF',
  'ELF',
  'GOBLINOID',
  'MERFOLK',
  'SHAPECHANGER',
  'DEMON',
  'DEVIL',
  'ORC',
  'SAHUAGIN',
  'TITAN',
  'KOBOLD',
  'GNOLL',
  'GRIMLOCK',
  'LIZARDFOLK',
  'GNOME'
]

const getSubtype = (subtype: string) => subtype.toLowerCase().replace(/_/g, ' ')

const MonsterSubtypeFilter = createEnumScalarType(
  'MonsterSubtypeFilter',
  'MonsterSubtype ("ANY_RACE", "HUMAN", "DWARF", "ELF", "GOBLINOID", "MERFOLK", "SHAPECHANGER", "DEMON", "DEVIL", "ORC", "SAHUAGIN", "TITAN", "KOBOLD", "GNOLL", "GRIMLOCK", "LIZARDFOLK", "GNOME") or list of MonsterSubtypes',
  subtypes,
  getSubtype
)

export default MonsterSubtypeFilter
