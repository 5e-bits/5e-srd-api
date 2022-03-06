import express from 'express';
const router = express.Router();
import LanguageController from '../../controllers/api/languageController';

router.get('/', function(req: any, res: any, next: any) {
  LanguageController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  LanguageController.show(req, res, next);
});

export default router;
