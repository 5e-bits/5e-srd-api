const router = require('express').Router();
const ApiController = require('../controllers/apiController');

router.get('/', ApiController.index);

router.use('/ability-scores', require('./api/abilityScores'));
router.use('/backgrounds', require('./api/backgrounds'))
router.use('/classes', require('./api/classes'));
router.use('/conditions', require('./api/conditions'));
router.use('/damage-types', require('./api/damageTypes'));
router.use('/equipment-categories', require('./api/equipmentCategories'));
router.use('/equipment', require('./api/equipment'));
router.use('/features', require('./api/features'));
router.use('/languages', require('./api/languages'));
router.use('/magic-items', require('./api/magicItems'));
router.use('/magic-schools', require('./api/magicSchools'));
router.use('/monsters', require('./api/monsters'));
router.use('/proficiencies', require('./api/proficiencies'));
router.use('/races', require('./api/races'));
router.use('/rules', require('./api/rules'));
router.use('/rule-sections', require('./api/rule-sections'));
router.use('/skills', require('./api/skills'));
router.use('/spells', require('./api/spells'));
router.use('/starting-equipment', require('./api/startingEquipment'));
router.use('/subclasses', require('./api/subclasses'));
router.use('/subraces', require('./api/subraces'));
router.use('/traits', require('./api/traits'));
router.use('/weapon-properties', require('./api/weaponProperties'));

module.exports = router;
