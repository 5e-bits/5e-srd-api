import * as express from 'express';

import SkillController from '../../controllers/api/skillController.js';

const router = express.Router();

router.get('/', function(req, res, next) {
  SkillController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  SkillController.show(req, res, next);
});
export default router;
