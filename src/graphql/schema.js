const { merge } = require('lodash');

// TODO: If we convert this to import style, we can combine abunch of these lines.
const AbilityScore = require('./abilityScore').typeDef;
const Class = require('./class').typeDef;
const Condition = require('./condition').typeDef;
const DamageType = require('./damageType').typeDef;
const Equipment = require('./equipment').typeDef;
const EquipmentCategory = require('./equipmentCategory').typeDef;
const Feature = require('./feature').typeDef;
const Language = require('./language').typeDef;
const Level = require('./level').typeDef;
const MagicItem = require('./magicItem').typeDef;
const MagicSchool = require('./magicSchool').typeDef;
const Monster = require('./monster').typeDef;
const Proficiency = require('./proficiency').typeDef;
const Race = require('./race').typeDef;
const Rule = require('./rule').typeDef;
const RuleSection = require('./ruleSection').typeDef;
const Skill = require('./skill').typeDef;
const Spell = require('./spell').typeDef;
const StartingEquipment = require('./startingEquipment').typeDef;
const Subclass = require('./subclass').typeDef;
const Subrace = require('./subrace').typeDef;
const Trait = require('./trait').typeDef;
const WeaponProperty = require('./weaponProperty').typeDef;

const abilityScoreResolvers = require('./abilityScore').resolvers;
const classResolvers = require('./class').resolvers;
const conditionResolvers = require('./condition').resolvers;
const damageTypeResolvers = require('./damageType').resolvers;
const equipmentResolvers = require('./equipment').resolvers;
const equipmentCategoryResolvers = require('./equipmentCategory').resolvers;
const featureResolvers = require('./feature').resolvers;
const languageResolvers = require('./language').resolvers;
const levelResolvers = require('./level').resolvers;
const magicItemResolvers = require('./magicItem').resolvers;
const magicSchoolResolvers = require('./magicSchool').resolvers;
const monsterResolvers = require('./monster').resolvers;
const proficiencyResolvers = require('./proficiency').resolvers;
const raceResolvers = require('./race').resolvers;
const ruleResolvers = require('./rule').resolvers;
const ruleSectionResolvers = require('./ruleSection').resolvers;
const skillResolvers = require('./skill').resolvers;
const spellResolvers = require('./spell').resolvers;
const startingEquipmentResolvers = require('./startingEquipment').resolvers;
const subclassResolvers = require('./subclass').resolvers;
const subraceResolvers = require('./subrace').resolvers;
const traitResolvers = require('./trait').resolvers;
const weaponPropertyResolvers = require('./weaponProperty').resolvers;

const Query = `
type Query {
  _empty: String
}
`;

module.exports = {
  typeDefs: [
    AbilityScore,
    Class,
    Condition,
    DamageType,
    Equipment,
    EquipmentCategory,
    Feature,
    Language,
    Level,
    MagicItem,
    MagicSchool,
    Monster,
    Proficiency,
    Race,
    Rule,
    RuleSection,
    Skill,
    Spell,
    StartingEquipment,
    Subclass,
    Subrace,
    Trait,
    WeaponProperty,
    Query
  ],
  resolvers: merge(
    abilityScoreResolvers,
    classResolvers,
    conditionResolvers,
    damageTypeResolvers,
    equipmentResolvers,
    equipmentCategoryResolvers,
    featureResolvers,
    languageResolvers,
    levelResolvers,
    magicItemResolvers,
    magicSchoolResolvers,
    monsterResolvers,
    proficiencyResolvers,
    raceResolvers,
    ruleResolvers,
    ruleSectionResolvers,
    skillResolvers,
    spellResolvers,
    startingEquipmentResolvers,
    subclassResolvers,
    subraceResolvers,
    traitResolvers,
    weaponPropertyResolvers
  )
};
