const AbilityScore = require('./abilityScoreResolver');
const Ammunition = require('./ammunitionResolver');
const AreaOfEffectTypeFilter = require('./scalars/areaOfEffectTypeFilter');
const Armor = require('./armorResolver');
const Background = require('./backgroundResolver');
const CastingTimeFilter = require('./scalars/castingTimeFilterResolver');
const Class = require('./classResolver');
const ClassSpecific = require('./classSpecificResolver');
const IEquipment = require('./iEquipmentResolver');
const IEquipmentBase = require('./iEquipmentBaseResolver');
const EquipmentCategory = require('./equipmentCategoryResolver');
const Feat = require('./featResolver');
const Feature = require('./featureResolver');
const FloatFilter = require('./scalars/floatFilterResolver');
const IGear = require('./iGearResolver');
const Gear = require('./gearResolver');
const IntFilter = require('./scalars/intFilterResolver');
const Language = require('./languageResolver');
const LanguageScriptFilter = require('./scalars/languageScriptFilterResolver');
const Level = require('./levelResolver');
const MagicItem = require('./magicItemResolver');
const MagicSchool = require('./magicShoolResolver');
const Monster = require('./monsterResolver');
const MonsterSubtypeFilter = require('./scalars/monsterSubtypeFilterResolver');
const MonsterTypeFilter = require('./scalars/monsterTypeFilterResolver');
const Pack = require('./packResolver');
const Proficiency = require('./proficiencyResolver');
const ProficiencyRace = require('./proficiencyRaceResolver');
const ProficiencyReference = require('./proficiencyReferenceResolver');
const ProficiencyTypeFilter = require('./scalars/proficiencyTypeFilterResolver');
const Race = require('./raceResolver');
const Rule = require('./ruleResolver');
const SizeFilter = require('./scalars/sizeFilterResolver');
const Skill = require('./skillResolver');
const Spell = require('./spellResolver');
const SpellAttackTypeFilter = require('./scalars/spellAttackTypeFilterResolver');
const SpellPrerequisite = require('./spellPrerequisiteResolver');
const StringFilter = require('./scalars/stringFilterResolver');
const Subclass = require('./subclassResolver');
const SubclassSpecific = require('./subclassSpecificResolver');
const Subrace = require('./subraceResolver');
const Tool = require('./toolResolver');
const Trait = require('./traitResolver');
const Query = require('./queryResolver');
const Vehicle = require('./vehicleResolver');
const Weapon = require('./weaponResolver');

import ActionCount from './scalars/actionCountResolver';
import EquipmentMultipleItem from './equipmentMultipleItemResolver';
import EquipmentOption from './equipmentOptionResolver';
import MonsterActionOption from './monsterActionOptionResolver';
import ProficiencyOption from './proficiencyOptionResolver';
import StartingEquipmentOptionSet from './startingEquipmentOptionSetResolver';

const resolvers = {
  AbilityScore,
  ActionCount,
  Ammunition,
  AreaOfEffectTypeFilter,
  Armor,
  Background,
  CastingTimeFilter,
  Class,
  ClassSpecific,
  IEquipment,
  IEquipmentBase,
  EquipmentCategory,
  EquipmentMultipleItem,
  EquipmentOption,
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

module.exports = resolvers;
