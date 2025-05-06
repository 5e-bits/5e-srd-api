import { createUnionType } from 'type-graphql'
import { Equipment } from '@/models/2014/equipment'
import { MagicItem } from '@/models/2014/magicItem'
import { EquipmentCategory } from '@/models/2014/equipmentCategory'
import { AbilityScore } from '@/models/2014/abilityScore'
import { Skill } from '@/models/2014/skill'
import { Level } from '@/models/2014/level'
import { Feature } from '@/models/2014/feature'

export const EquipmentOrMagicItem = createUnionType({
  name: 'EquipmentOrMagicItem',
  types: () => [Equipment, MagicItem] as const,
  resolveType: (value) => {
    if ('rarity' in value) {
      return MagicItem
    }
    return Equipment
  }
})

// Union type for Proficiency.reference
export const ProficiencyReference = createUnionType({
  name: 'ProficiencyReference',
  // Types that can be referenced by a proficiency
  types: () => [Equipment, EquipmentCategory, AbilityScore, Skill] as const,
  // Logic to determine the object type at runtime
  resolveType: (value) => {
    // Check for properties unique to each type
    if ('equipment' in value) {
      return EquipmentCategory // EquipmentCategory has an 'equipment' field
    }
    if ('full_name' in value) {
      return AbilityScore // AbilityScore has a 'full_name' field
    }
    if ('desc' in value && Array.isArray(value.desc)) {
      return Skill // Skill has a 'desc' field which is an array of strings
    }
    // Equipment is the remaining option (assuming it doesn't uniquely have the others)
    // More specific checks like 'weapon_category' or 'armor_class' could be added if needed.
    return Equipment
  }
})

// Union type for SubclassSpell.prerequisites
export const SubclassSpellPrerequisiteUnion = createUnionType({
  name: 'SubclassSpellPrerequisite',
  types: () => [Level, Feature] as const,
  resolveType: (value) => {
    if ('prof_bonus' in value || 'spellcasting' in value || 'features' in value) {
      return Level
    }
    if ('subclass' in value || 'feature_specific' in value || 'prerequisites' in value) {
      return Feature
    }

    console.warn('Could not reliably resolve type for SubclassSpellPrerequisiteUnion:', value)
    throw new Error('Could not resolve type for SubclassSpellPrerequisiteUnion')
  }
})
