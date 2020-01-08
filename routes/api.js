const router = require('express').Router();
const ApiController = require('../controllers/apiController');

router.get('/', ApiController.index);

router.use('/ability-scores', require('./abilityScores'));
router.use('/classes', require('./classes'));
router.use('/conditions', require('./conditions'));
router.use('/damage-types', require('./damageTypes'));
router.use('/equipment-categories', require('./equipmentCategories'));
router.use('/equipment', require('./equipment'));
router.use('/features', require('./features'));
router.use('/languages', require('./languages'));
router.use('/magic-schools', require('./magicSchools'));
router.use('/monsters', require('./monsters'));
router.use('/proficiencies', require('./proficiencies'));
router.use('/races', require('./races'));
router.use('/skills', require('./skills'));
router.use('/spellcasting', require('./spellcasting'));
router.use('/spells', require('./spells'));
router.use('/startingequipment', require('./startingEquipment'));
router.use('/subclasses', require('./subclasses'));
router.use('/subraces', require('./subraces'));
router.use('/traits', require('./traits'));
router.use('/weapon-properties', require('./weaponProperties'));

module.exports = router;
