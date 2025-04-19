import { createEnumScalarType } from './enumFilterResolver'

const types = [
  'WEAPONS',
  'ARTISANS_TOOLS',
  'SKILLS',
  'ARMOR',
  'MUSICAL_INSTRUMENTS',
  'SAVING_THROWS',
  'OTHER',
  'GAMING_SETS',
  'VEHICLES'
]

const getType = (type: string) => {
  if (type === 'ARTISANS_TOOLS') {
    return 'Artisan\'s Tools'
  } else {
    const words = type.split('_')
    for (let i = 0; i < words.length; ++i) {
      words[i] = words[i][0] + words[i].slice(1).toLowerCase()
    }

    return words.join(' ')
  }
}

const ProficiencyTypeFilter = createEnumScalarType(
  'ProficiencyTypeFilter',
  'ProficiencyType ("WEAPONS", "ARTISANS_TOOLS", "SKILLS", "ARMOR", "MUSICAL_INSTRUMENTS", "SAVING_THROWS", "OTHER", "GAMING_SETS", "VEHICLES") or list of ProficiencyTypes',
  types,
  getType
)

export default ProficiencyTypeFilter
