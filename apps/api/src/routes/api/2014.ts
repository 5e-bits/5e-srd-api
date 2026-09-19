import express from 'express'

import AbilityScoreController from '@/controllers/api/2014/abilityScoreController'
import AlignmentController from '@/controllers/api/2014/alignmentController'
import BackgroundController from '@/controllers/api/2014/backgroundController'
import ConditionController from '@/controllers/api/2014/conditionController'
import DamageTypeController from '@/controllers/api/2014/damageTypeController'
import EquipmentCategoryController from '@/controllers/api/2014/equipmentCategoryController'
import EquipmentController from '@/controllers/api/2014/equipmentController'
import FeatController from '@/controllers/api/2014/featController'
import FeatureController from '@/controllers/api/2014/featureController'
import LanguageController from '@/controllers/api/2014/languageController'
import * as MagicItemController from '@/controllers/api/2014/magicItemController'
import MagicSchoolController from '@/controllers/api/2014/magicSchoolController'
import * as MonsterController from '@/controllers/api/2014/monsterController'
import ProficiencyController from '@/controllers/api/2014/proficiencyController'
import * as RuleController from '@/controllers/api/2014/ruleController'
import * as RuleSectionController from '@/controllers/api/2014/ruleSectionController'
import SkillController from '@/controllers/api/2014/skillController'
import * as SpellController from '@/controllers/api/2014/spellController'
import TraitController from '@/controllers/api/2014/traitController'
import WeaponPropertyController from '@/controllers/api/2014/weaponPropertyController'
import { index } from '@/controllers/api/v2014Controller'
import { simpleRouter } from '@/routes/simpleRouter'

import ClassesHandler from './2014/classes'
import ImageHandler from './2014/images'
import LocalesHandler from './2014/locales'
import RacesHandler from './2014/races'
import SubclassesHandler from './2014/subclasses'
import SubracesHandler from './2014/subraces'

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
router.use('/equipment-categories', simpleRouter(EquipmentCategoryController))
router.use('/equipment', simpleRouter(EquipmentController))
router.use('/feats', simpleRouter(FeatController))
router.use('/features', simpleRouter(FeatureController))
router.use('/images', ImageHandler)
router.use('/languages', simpleRouter(LanguageController))
router.use('/locales', LocalesHandler)
router.use('/magic-items', simpleRouter(MagicItemController))
router.use('/magic-schools', simpleRouter(MagicSchoolController))
router.use('/monsters', simpleRouter(MonsterController))
router.use('/proficiencies', simpleRouter(ProficiencyController))
router.use('/races', RacesHandler)
router.use('/rules', simpleRouter(RuleController))
router.use('/rule-sections', simpleRouter(RuleSectionController))
router.use('/skills', simpleRouter(SkillController))
router.use('/spells', simpleRouter(SpellController))
router.use('/subclasses', SubclassesHandler)
router.use('/subraces', SubracesHandler)
router.use('/traits', simpleRouter(TraitController))
router.use('/weapon-properties', simpleRouter(WeaponPropertyController))

export default router
