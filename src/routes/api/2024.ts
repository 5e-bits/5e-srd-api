import express from 'express'

import { index } from '@/controllers/api/v2024Controller'

import AbilityScoresHandler from './2024/abilityScores'
import AlignmentsHandler from './2024/alignments'
import BackgroundsHandler from './2024/backgrounds'
import ConditionsHandler from './2024/conditions'
import DamageTypesHandler from './2024/damageTypes'
import EquipmentHandler from './2024/equipment'
import EquipmentCategoriesHandler from './2024/equipmentCategories'
import FeatsHandler from './2024/feats'
import LanguagesHandler from './2024/languages'
import MagicItemsHandler from './2024/magicItems'
import MagicSchoolsHandler from './2024/magicSchools'
import ProficienciesHandler from './2024/proficiencies'
import SkillsHandler from './2024/skills'
import SpeciesHandler from './2024/species'
import SubclassesHandler from './2024/subclasses'
import SubspeciesHandler from './2024/subspecies'
import TraitsHandler from './2024/traits'
import WeaponMasteryPropertiesHandler from './2024/weaponMasteryProperties'
import WeaponPropertiesHandler from './2024/weaponProperty'

const router = express.Router()

router.get('/', function (req, res, next) {
  index(req, res, next)
})

router.use('/ability-scores', AbilityScoresHandler)
router.use('/alignments', AlignmentsHandler)
router.use('/backgrounds', BackgroundsHandler)
router.use('/conditions', ConditionsHandler)
router.use('/damage-types', DamageTypesHandler)
router.use('/equipment', EquipmentHandler)
router.use('/equipment-categories', EquipmentCategoriesHandler)
router.use('/feats', FeatsHandler)
router.use('/languages', LanguagesHandler)
router.use('/magic-items', MagicItemsHandler)
router.use('/magic-schools', MagicSchoolsHandler)
router.use('/proficiencies', ProficienciesHandler)
router.use('/skills', SkillsHandler)
router.use('/species', SpeciesHandler)
router.use('/subclasses', SubclassesHandler)
router.use('/subspecies', SubspeciesHandler)
router.use('/traits', TraitsHandler)
router.use('/weapon-mastery-properties', WeaponMasteryPropertiesHandler)
router.use('/weapon-properties', WeaponPropertiesHandler)

export default router
