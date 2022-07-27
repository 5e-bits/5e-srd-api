import * as express from 'express';

import AlignmentController from '../../controllers/api/alignmentController.js';

const router = express.Router();


router.get('/', function(req: any, res: any, next: any) {
  AlignmentController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  AlignmentController.show(req, res, next);
});

export default router;
