import * as express from 'express';

import TraitController from '../../controllers/api/traitController.js';

const router = express.Router();


router.get('/', function(req: any, res: any, next: any) {
  TraitController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  TraitController.show(req, res, next);
});

export default router;
