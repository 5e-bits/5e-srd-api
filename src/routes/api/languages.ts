import * as express from 'express';

import LanguageController from '../../controllers/api/languageController.js';

const router = express.Router();


router.get('/', function(req: any, res: any, next: any) {
  LanguageController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  LanguageController.show(req, res, next);
});

export default router;
