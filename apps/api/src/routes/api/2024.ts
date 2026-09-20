import express from 'express'

import AbilityScoreController from '@/controllers/api/2024/abilityScoreController'
import AlignmentController from '@/controllers/api/2024/alignmentController'
import BackgroundController from '@/controllers/api/2024/backgroundController'
import ConditionController from '@/controllers/api/2024/conditionController'
import DamageTypeController from '@/controllers/api/2024/damageTypeController'
import EquipmentCategoryController from '@/controllers/api/2024/equipmentCategoryController'
import EquipmentController from '@/controllers/api/2024/equipmentController'
import FeatController from '@/controllers/api/2024/featController'
import FeatureController from '@/controllers/api/2024/featureController'
import LanguageController from '@/controllers/api/2024/languageController'
import MagicItemController from '@/controllers/api/2024/magicItemController'
import MagicSchoolController from '@/controllers/api/2024/magicSchoolController'
import MonsterController from '@/controllers/api/2024/monsterController'
import PoisonController from '@/controllers/api/2024/poisonController'
import ProficiencyController from '@/controllers/api/2024/proficiencyController'
import SkillController from '@/controllers/api/2024/skillController'
import * as SpellController from '@/controllers/api/2024/spellController'
import TraitController from '@/controllers/api/2024/traitController'
import WeaponMasteryPropertyController from '@/controllers/api/2024/weaponMasteryPropertyController'
import WeaponPropertyController from '@/controllers/api/2024/weaponPropertyController'
import { index } from '@/controllers/api/v2024Controller'
import { simpleRouter } from '@/routes/simpleRouter'

import ClassesHandler from './2024/classes'
import LocalesHandler from './2024/locales'
import SpeciesHandler from './2024/species'
import SubclassesHandler from './2024/subclasses'
import SubspeciesHandler from './2024/subspecies'

const router = express.Router()

router.get('/', function (req, res, next) {
  index(req, res, next)
})

router.use('/ability-scores', simpleRouter(AbilityScoreController))
router.use('/alignments', simpleRouter(AlignmentController))
router.use('/backgrounds', simpleRouter(BackgroundController))
router.use('/classes', ClassesHandler)
router.use('/conditions', simpleRouter(ConditionController))
router.use('/damage-types', simpleRouter(DamageTypeController))
router.use('/equipment', simpleRouter(EquipmentController))
router.use('/equipment-categories', simpleRouter(EquipmentCategoryController))
router.use('/feats', simpleRouter(FeatController))
router.use('/features', simpleRouter(FeatureController))
router.use('/languages', simpleRouter(LanguageController))
router.use('/locales', LocalesHandler)
router.use('/magic-items', simpleRouter(MagicItemController))
router.use('/magic-schools', simpleRouter(MagicSchoolController))
router.use('/monsters', simpleRouter(MonsterController))
router.use('/poisons', simpleRouter(PoisonController))
router.use('/proficiencies', simpleRouter(ProficiencyController))
router.use('/skills', simpleRouter(SkillController))
router.use('/species', SpeciesHandler)
router.use('/spells', simpleRouter(SpellController))
router.use('/subclasses', SubclassesHandler)
router.use('/subspecies', SubspeciesHandler)
router.use('/traits', simpleRouter(TraitController))
router.use('/weapon-mastery-properties', simpleRouter(WeaponMasteryPropertyController))
router.use('/weapon-properties', simpleRouter(WeaponPropertyController))

export default router
