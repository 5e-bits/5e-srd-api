import * as express from 'express';
import * as ApiController from '../controllers/apiController';
import {
  AbilityScoresHandler,
  AlignmentsHandler,
  BackgroundsHandler,
  ClassesHandler,
  ConditionsHandler,
  DamageTypesHandler,
  EquipmentCategoriesHandler,
  EquipmentHandler,
  FeatsHandler,
  FeaturesHandler,
  LanguagesHandler,
  MagicItemsHandler,
  MagicSchoolsHandler,
  MonstersHandler,
  ProficienciesHandler,
  RacesHandler,
  RuleSectionsHandler,
  RulesHandler,
  SkillsHandler,
  SpellsHandler,
  SubclassesHandler,
  SubracesHandler,
  TraitsHandler,
  WeaponPropertiesHandler,
} from './api/';

const router = express.Router();

router.get('/', ApiController.index);

router.use('/ability-scores', AbilityScoresHandler);
router.use('/alignments', AlignmentsHandler);
router.use('/backgrounds', BackgroundsHandler);
router.use('/classes', ClassesHandler);
router.use('/conditions', ConditionsHandler);
router.use('/damage-types', DamageTypesHandler);
router.use('/equipment-categories', EquipmentCategoriesHandler);
router.use('/equipment', EquipmentHandler);
router.use('/feats', FeatsHandler);
router.use('/features', FeaturesHandler);
router.use('/languages', LanguagesHandler);
router.use('/magic-items', MagicItemsHandler);
router.use('/magic-schools', MagicSchoolsHandler);
router.use('/monsters', MonstersHandler);
router.use('/proficiencies', ProficienciesHandler);
router.use('/races', RacesHandler);
router.use('/rules', RulesHandler);
router.use('/rule-sections', RuleSectionsHandler);
router.use('/skills', SkillsHandler);
router.use('/spells', SpellsHandler);
router.use('/subclasses', SubclassesHandler);
router.use('/subraces', SubracesHandler);
router.use('/traits', TraitsHandler);
router.use('/weapon-properties', WeaponPropertiesHandler);

export default router;
