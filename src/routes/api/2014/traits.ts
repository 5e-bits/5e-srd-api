import * as express from 'express';

import TraitController from '../../../controllers/api/2014/traitController.js';

const router = express.Router();

router.get('/', function (req, res, next) {
  TraitController.index(req, res, next);
});

router.get('/:index', function (req, res, next) {
  TraitController.show(req, res, next);
});

export default router;
