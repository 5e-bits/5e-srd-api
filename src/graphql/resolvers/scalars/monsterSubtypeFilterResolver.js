import { createEnumScalarType } from './enumFilterResolver.js';

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
  'GNOME',
];

const getSubtype = subtype => subtype.toLowerCase().replace('_', ' ');

const MonsterSubtypeFilter = createEnumScalarType(
  'MonsterSubtypeFilter',
  'MonsterSubtype or list of MonsterSubtypes',
  subtypes,
  getSubtype
);

export default MonsterSubtypeFilter;
