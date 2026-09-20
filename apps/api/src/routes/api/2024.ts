import express from 'express'

import SpellController from '@/controllers/api/2024/spellController'
import { versionIndex } from '@/controllers/api/versionIndexController'
import SimpleController from '@/controllers/simpleController'
import AbilityScoreModel from '@/models/2024/abilityScore'
import AlignmentModel from '@/models/2024/alignment'
import BackgroundModel from '@/models/2024/background'
import Collection from '@/models/2024/collection'
import ConditionModel from '@/models/2024/condition'
import DamageTypeModel from '@/models/2024/damageType'
import Equipment from '@/models/2024/equipment'
import EquipmentCategory from '@/models/2024/equipmentCategory'
import FeatModel from '@/models/2024/feat'
import Feature2024Model from '@/models/2024/feature'
import LanguageModel from '@/models/2024/language'
import Locale2024Model from '@/models/2024/locale'
import MagicItemModel from '@/models/2024/magicItem'
import MagicSchoolModel from '@/models/2024/magicSchool'
import Monster2024Model from '@/models/2024/monster'
import Poison2024Model from '@/models/2024/poison'
import ProficiencyModel from '@/models/2024/proficiency'
import Skill from '@/models/2024/skill'
import Trait2024Model from '@/models/2024/trait'
import WeaponMasteryPropertyModel from '@/models/2024/weaponMasteryProperty'
import WeaponPropertyModel from '@/models/2024/weaponProperty'
import { localeRouter } from '@/routes/localeRouter'
import { simpleRouter } from '@/routes/simpleRouter'

import ClassesHandler from './2024/classes'
import SpeciesHandler from './2024/species'
import SubclassesHandler from './2024/subclasses'
import SubspeciesHandler from './2024/subspecies'

const router = express.Router()

router.get('/', versionIndex('2024', Collection))

router.use('/ability-scores', simpleRouter(new SimpleController(AbilityScoreModel)))
router.use('/alignments', simpleRouter(new SimpleController(AlignmentModel)))
router.use('/backgrounds', simpleRouter(new SimpleController(BackgroundModel)))
router.use('/classes', ClassesHandler)
router.use('/conditions', simpleRouter(new SimpleController(ConditionModel)))
router.use('/damage-types', simpleRouter(new SimpleController(DamageTypeModel)))
router.use('/equipment', simpleRouter(new SimpleController(Equipment)))
router.use('/equipment-categories', simpleRouter(new SimpleController(EquipmentCategory)))
router.use('/feats', simpleRouter(new SimpleController(FeatModel)))
router.use('/features', simpleRouter(new SimpleController(Feature2024Model)))
router.use('/languages', simpleRouter(new SimpleController(LanguageModel)))
router.use('/locales', localeRouter('2024', Locale2024Model))
router.use('/magic-items', simpleRouter(new SimpleController(MagicItemModel)))
router.use('/magic-schools', simpleRouter(new SimpleController(MagicSchoolModel)))
router.use('/monsters', simpleRouter(new SimpleController(Monster2024Model)))
router.use('/poisons', simpleRouter(new SimpleController(Poison2024Model)))
router.use('/proficiencies', simpleRouter(new SimpleController(ProficiencyModel)))
router.use('/skills', simpleRouter(new SimpleController(Skill)))
router.use('/species', SpeciesHandler)
router.use('/spells', simpleRouter(SpellController))
router.use('/subclasses', SubclassesHandler)
router.use('/subspecies', SubspeciesHandler)
router.use('/traits', simpleRouter(new SimpleController(Trait2024Model)))
router.use(
  '/weapon-mastery-properties',
  simpleRouter(new SimpleController(WeaponMasteryPropertyModel))
)
router.use('/weapon-properties', simpleRouter(new SimpleController(WeaponPropertyModel)))

export default router
