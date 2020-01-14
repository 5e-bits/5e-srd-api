const router = require('express').Router();
const MonsterController = require('../../controllers/api/monsterController');

router.get('/', MonsterController.index);
router.get('/:index', MonsterController.show);

module.exports = router;
