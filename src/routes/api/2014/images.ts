import * as express from 'express';

import ImageController from '@/controllers/api/2014/imageController';

const router = express.Router();

router.get('/*', function (req, res, next) {
  ImageController.show(req, res, next);
});

export default router;
