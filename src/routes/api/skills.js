const router = require('express').Router();
const SkillController = require('../../controllers/api/skillController');

router.get('/', function(req, res, next) {
  SkillController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  SkillController.show(req, res, next);
});
module.exports = router;
