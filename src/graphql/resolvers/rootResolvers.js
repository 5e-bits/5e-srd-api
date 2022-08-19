import AbilityScore from './abilityScoreResolver.js';
import ActionCount from './scalars/actionCountResolver.js';
import Ammunition from './ammunitionResolver.js';
import AreaOfEffectTypeFilter from './scalars/areaOfEffectTypeFilter.js';
import Armor from './armorResolver.js';
import Background from './backgroundResolver.js';
import Class from './classResolver.js';
import ClassSpecific from './classSpecificResolver.js';
import EquipmentCategory from './equipmentCategoryResolver.js';
import EquipmentMultipleItem from './equipmentMultipleItemResolver.js';
import EquipmentOption from './equipmentOptionResolver.js';
import ExpertiseOption from './expertiseOptionResolver.js';
import Feat from './featResolver.js';
import Feature from './featureResolver.js';
import FloatFilter from './scalars/floatFilterResolver.js';
import Gear from './gearResolver.js';
import IEquipment from './iEquipmentResolver.js';
import IEquipmentBase from './iEquipmentBaseResolver.js';
import IGear from './iGearResolver.js';
import IntFilter from './scalars/intFilterResolver.js';
import Language from './languageResolver.js';
import LanguageScriptFilter from './scalars/languageScriptFilterResolver.js';
import Level from './levelResolver.js';
import MagicItem from './magicItemResolver.js';
import MagicSchool from './magicShoolResolver.js';
import Monster from './monsterResolver.js';
import MonsterActionOption from './monsterActionOptionResolver.js';
import MonsterSubtypeFilter from './scalars/monsterSubtypeFilterResolver.js';
import MonsterTypeFilter from './scalars/monsterTypeFilterResolver.js';
import Pack from './packResolver.js';
import Proficiency from './proficiencyResolver.js';
import ProficiencyOption from './proficiencyOptionResolver.js';
import ProficiencyRace from './proficiencyRaceResolver.js';
import ProficiencyReference from './proficiencyReferenceResolver.js';
import ProficiencyTypeFilter from './scalars/proficiencyTypeFilterResolver.js';
import Query from './queryResolver.js';
import Race from './raceResolver.js';
import Rule from './ruleResolver.js';
import SizeFilter from './scalars/sizeFilterResolver.js';
import Skill from './skillResolver.js';
import Spell from './spellResolver.js';
import SpellAttackTypeFilter from './scalars/spellAttackTypeFilterResolver.js';
import SpellPrerequisite from './spellPrerequisiteResolver.js';
import StartingEquipmentOptionSet from './startingEquipmentOptionSetResolver.js';
import StringFilter from './scalars/stringFilterResolver.js';
import Subclass from './subclassResolver.js';
import SubclassSpecific from './subclassSpecificResolver.js';
import Subrace from './subraceResolver.js';
import Tool from './toolResolver.js';
import Trait from './traitResolver.js';
import Vehicle from './vehicleResolver.js';
import Weapon from './weaponResolver.js';

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
  Language,
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
  Weapon,
};

export default resolvers;
