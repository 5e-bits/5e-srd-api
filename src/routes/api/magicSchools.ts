import * as express from 'express';

import MagicSchoolController from '../../controllers/api/magicSchoolController.js';

const router = express.Router();


router.get('/', function(req: any, res: any, next: any) {
  MagicSchoolController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  MagicSchoolController.show(req, res, next);
});

export default router;
