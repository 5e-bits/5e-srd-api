import * as express from 'express';

import ProficiencyController from '../../controllers/api/proficiencyController.js';

const router = express.Router();


router.get('/', function(req: any, res: any, next: any) {
  ProficiencyController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  ProficiencyController.show(req, res, next);
});

export default router;
