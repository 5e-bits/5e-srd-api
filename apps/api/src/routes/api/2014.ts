import express from 'express'

import MagicItemController from '@/controllers/api/2014/magicItemController'
import MonsterController from '@/controllers/api/2014/monsterController'
import RuleController from '@/controllers/api/2014/ruleController'
import SpellController from '@/controllers/api/2014/spellController'
import { versionIndex } from '@/controllers/api/versionIndexController'
import SimpleController from '@/controllers/simpleController'
import AbilityScoreModel from '@/models/2014/abilityScore'
import AlignmentModel from '@/models/2014/alignment'
import Background from '@/models/2014/background'
import Collection from '@/models/2014/collection'
import ConditionModel from '@/models/2014/condition'
import DamageType from '@/models/2014/damageType'
import Equipment from '@/models/2014/equipment'
import EquipmentCategory from '@/models/2014/equipmentCategory'
import Feat from '@/models/2014/feat'
import Feature from '@/models/2014/feature'
import Language from '@/models/2014/language'
import Locale2014Model from '@/models/2014/locale'
import MagicSchool from '@/models/2014/magicSchool'
import Proficiency from '@/models/2014/proficiency'
import Skill from '@/models/2014/skill'
import Trait from '@/models/2014/trait'
import WeaponProperty from '@/models/2014/weaponProperty'
import { localeRouter } from '@/routes/localeRouter'
import { simpleRouter } from '@/routes/simpleRouter'

import ClassesHandler from './2014/classes'
import RacesHandler from './2014/races'
import SubclassesHandler from './2014/subclasses'
import SubracesHandler from './2014/subraces'
import ImageHandler from './images'

const router = express.Router()

router.get('/', versionIndex('2014', Collection))

router.use('/ability-scores', simpleRouter(new SimpleController(AbilityScoreModel)))
router.use('/alignments', simpleRouter(new SimpleController(AlignmentModel)))
router.use('/backgrounds', simpleRouter(new SimpleController(Background)))
router.use('/classes', ClassesHandler)
router.use('/conditions', simpleRouter(new SimpleController(ConditionModel)))
router.use('/damage-types', simpleRouter(new SimpleController(DamageType)))
router.use('/equipment-categories', simpleRouter(new SimpleController(EquipmentCategory)))
router.use('/equipment', simpleRouter(new SimpleController(Equipment)))
router.use('/feats', simpleRouter(new SimpleController(Feat)))
router.use('/features', simpleRouter(new SimpleController(Feature)))
router.use('/images', ImageHandler)
router.use('/languages', simpleRouter(new SimpleController(Language)))
router.use('/locales', localeRouter('2014', Locale2014Model))
router.use('/magic-items', simpleRouter(MagicItemController))
router.use('/magic-schools', simpleRouter(new SimpleController(MagicSchool)))
router.use('/monsters', simpleRouter(MonsterController))
router.use('/proficiencies', simpleRouter(new SimpleController(Proficiency)))
router.use('/races', RacesHandler)
router.use('/rules', simpleRouter(RuleController))
router.use('/skills', simpleRouter(new SimpleController(Skill)))
router.use('/spells', simpleRouter(SpellController))
router.use('/subclasses', SubclassesHandler)
router.use('/subraces', SubracesHandler)
router.use('/traits', simpleRouter(new SimpleController(Trait)))
router.use('/weapon-properties', simpleRouter(new SimpleController(WeaponProperty)))

export default router
