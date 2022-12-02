import * as express from 'express';

import BackgroundController from '../../controllers/api/backgroundController.js';

const router = express.Router();

router.get('/', function(req, res, next) {
  BackgroundController.index(req, res, next);
});

router.get('/:index', function(req, res, next) {
  BackgroundController.show(req, res, next);
});

export default router;
