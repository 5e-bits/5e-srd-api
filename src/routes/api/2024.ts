import express from 'express'

import { index } from '@/controllers/api/v2024Controller'

import AbilityScoresHandler from './2024/abilityScores'
import AlignmentsHandler from './2024/alignments'
import ConditionsHandler from './2024/conditions'
import DamageTypesHandler from './2024/damageTypes'
import EquipmentHandler from './2024/equipment'
import EquipmentCategoriesHandler from './2024/equipmentCategories'
import LanguagesHandler from './2024/languages'
import MagicSchoolsHandler from './2024/magicSchools'
import SkillsHandler from './2024/skills'
import WeaponMasteryPropertiesHandler from './2024/weaponMasteryProperties'
import WeaponPropertiesHandler from './2024/weaponProperty'

const router = express.Router()

router.get('/', function (req, res, next) {
  index(req, res, next)
})

router.use('/ability-scores', AbilityScoresHandler)
router.use('/alignments', AlignmentsHandler)
router.use('/conditions', ConditionsHandler)
router.use('/damage-types', DamageTypesHandler)
router.use('/equipment', EquipmentHandler)
router.use('/equipment-categories', EquipmentCategoriesHandler)
router.use('/languages', LanguagesHandler)
router.use('/magic-schools', MagicSchoolsHandler)
router.use('/skills', SkillsHandler)
router.use('/weapon-mastery-properties', WeaponMasteryPropertiesHandler)
router.use('/weapon-properties', WeaponPropertiesHandler)

export default router
