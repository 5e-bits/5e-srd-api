import * as express from 'express';

import { index, show } from '../../controllers/api/equipmentCategoryController.js';

const router = express.Router();

router.get('/', function(req, res, next) {
  index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  show(req, res, next);
});

export default router;
