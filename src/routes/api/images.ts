import * as express from 'express';

import ImageController from '../../controllers/api/imageController.js';

const router = express.Router();

router.get('/*', function(req: any, res: any, next: any) {
  ImageController.show(req, res, next);
});

export default router;
