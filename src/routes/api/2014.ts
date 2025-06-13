import express from 'express'

import { index } from '@/controllers/api/v2014Controller'

import AbilityScoresHandler from './2014/abilityScores'
import AlignmentsHandler from './2014/alignments'
import BackgroundsHandler from './2014/backgrounds'
import ClassesHandler from './2014/classes'
import ConditionsHandler from './2014/conditions'
import DamageTypesHandler from './2014/damageTypes'
import EquipmentHandler from './2014/equipment'
import EquipmentCategoriesHandler from './2014/equipmentCategories'
import FeatsHandler from './2014/feats'
import FeaturesHandler from './2014/features'
import ImageHandler from './2014/images'
import LanguagesHandler from './2014/languages'
import MagicItemsHandler from './2014/magicItems'
import MagicSchoolsHandler from './2014/magicSchools'
import MonstersHandler from './2014/monsters'
import ProficienciesHandler from './2014/proficiencies'
import RacesHandler from './2014/races'
import RulesHandler from './2014/rules'
import RuleSectionsHandler from './2014/ruleSections'
import SkillsHandler from './2014/skills'
import SpellsHandler from './2014/spells'
import SubclassesHandler from './2014/subclasses'
import SubracesHandler from './2014/subraces'
import TraitsHandler from './2014/traits'
import WeaponPropertiesHandler from './2014/weaponProperties'

const router = express.Router()

router.get('/', function (req, res, next) {
  index(req, res, next)
})

router.use('/ability-scores', AbilityScoresHandler)
router.use('/alignments', AlignmentsHandler)
router.use('/backgrounds', BackgroundsHandler)
router.use('/classes', ClassesHandler)
router.use('/conditions', ConditionsHandler)
router.use('/damage-types', DamageTypesHandler)
router.use('/equipment-categories', EquipmentCategoriesHandler)
router.use('/equipment', EquipmentHandler)
router.use('/feats', FeatsHandler)
router.use('/features', FeaturesHandler)
router.use('/images', ImageHandler)
router.use('/languages', LanguagesHandler)
router.use('/magic-items', MagicItemsHandler)
router.use('/magic-schools', MagicSchoolsHandler)
router.use('/monsters', MonstersHandler)
router.use('/proficiencies', ProficienciesHandler)
router.use('/races', RacesHandler)
router.use('/rules', RulesHandler)
router.use('/rule-sections', RuleSectionsHandler)
router.use('/skills', SkillsHandler)
router.use('/spells', SpellsHandler)
router.use('/subclasses', SubclassesHandler)
router.use('/subraces', SubracesHandler)
router.use('/traits', TraitsHandler)
router.use('/weapon-properties', WeaponPropertiesHandler)

export default router
