import * as express from 'express';

import AlignmentController from '../../controllers/api/alignmentController.js';

const router = express.Router();

router.get('/', function(req, res, next) {
  AlignmentController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  AlignmentController.show(req, res, next);
});

export default router;
