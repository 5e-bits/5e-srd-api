import AbilityScore from './abilityScoreResolver'
import ActionCount from './scalars/actionCountResolver'
import Ammunition from './ammunitionResolver'
import AreaOfEffectTypeFilter from './scalars/areaOfEffectTypeFilter'
import Armor from './armorResolver'
import Background from './backgroundResolver'
import Class from './classResolver'
import ClassSpecific from './classSpecificResolver'
import EquipmentCategory from './equipmentCategoryResolver'
import EquipmentMultipleItem from './equipmentMultipleItemResolver'
import EquipmentOption from './equipmentOptionResolver'
import ExpertiseOption from './expertiseOptionResolver'
import Feat from './featResolver'
import Feature from './featureResolver'
import FloatFilter from './scalars/floatFilterResolver'
import Gear from './gearResolver'
import IEquipment from './iEquipmentResolver'
import IEquipmentBase from './iEquipmentBaseResolver'
import IGear from './iGearResolver'
import IntFilter from './scalars/intFilterResolver'
import LanguageScriptFilter from './scalars/languageScriptFilterResolver'
import Level from './levelResolver'
import MagicItem from './magicItemResolver'
import MagicSchool from './magicShoolResolver'
import Monster from './monsterResolver'
import MonsterActionOption from './monsterActionOptionResolver'
import MonsterSubtypeFilter from './scalars/monsterSubtypeFilterResolver'
import MonsterTypeFilter from './scalars/monsterTypeFilterResolver'
import Pack from './packResolver'
import Proficiency from './proficiencyResolver'
import ProficiencyOption from './proficiencyOptionResolver'
import ProficiencyRace from './proficiencyRaceResolver'
import ProficiencyReference from './proficiencyReferenceResolver'
import ProficiencyTypeFilter from './scalars/proficiencyTypeFilterResolver'
import Query from './queryResolver'
import Race from './raceResolver'
import Rule from './ruleResolver'
import SizeFilter from './scalars/sizeFilterResolver'
import Skill from './skillResolver'
import Spell from './spellResolver'
import SpellAttackTypeFilter from './scalars/spellAttackTypeFilterResolver'
import SpellPrerequisite from './spellPrerequisiteResolver'
import StartingEquipmentOptionSet from './startingEquipmentOptionSetResolver'
import StringFilter from './scalars/stringFilterResolver'
import Subclass from './subclassResolver'
import SubclassSpecific from './subclassSpecificResolver'
import Subrace from './subraceResolver'
import Tool from './toolResolver'
import Trait from './traitResolver'
import Vehicle from './vehicleResolver'
import Weapon from './weaponResolver'

const resolvers = {
  AbilityScore,
  ActionCount,
  Ammunition,
  AreaOfEffectTypeFilter,
  Armor,
  Background,
  Class,
  ClassSpecific,
  IEquipment,
  IEquipmentBase,
  EquipmentCategory,
  EquipmentMultipleItem,
  EquipmentOption,
  ExpertiseOption,
  Feat,
  Feature,
  FloatFilter,
  IGear,
  Gear,
  IntFilter,
  LanguageScriptFilter,
  Level,
  MagicItem,
  MagicSchool,
  MonsterActionOption,
  Monster,
  MonsterSubtypeFilter,
  MonsterTypeFilter,
  Pack,
  Proficiency,
  ProficiencyOption,
  ProficiencyRace,
  ProficiencyReference,
  ProficiencyTypeFilter,
  Race,
  Rule,
  SizeFilter,
  Skill,
  Spell,
  SpellAttackTypeFilter,
  SpellPrerequisite,
  StartingEquipmentOptionSet,
  StringFilter,
  Subclass,
  SubclassSpecific,
  Subrace,
  Tool,
  Trait,
  Query,
  Vehicle,
  Weapon
}

export default resolvers
