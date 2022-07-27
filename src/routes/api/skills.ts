import * as express from 'express';

import SkillController from '../../controllers/api/skillController.js';

const router = express.Router();


router.get('/', function(req: any, res: any, next: any) {
  SkillController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  SkillController.show(req, res, next);
});
export default router;
