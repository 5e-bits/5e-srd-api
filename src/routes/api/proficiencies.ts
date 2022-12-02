import * as express from 'express';

import ProficiencyController from '../../controllers/api/proficiencyController.js';

const router = express.Router();

router.get('/', function(req, res, next) {
  ProficiencyController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  ProficiencyController.show(req, res, next);
});

export default router;
