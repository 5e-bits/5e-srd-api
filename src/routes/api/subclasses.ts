import * as express from 'express';
const router = express.Router();
import SubclassController from '../../controllers/api/subclassController';

router.get('/', function(req: any, res: any, next: any) {
  SubclassController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  SubclassController.show(req, res, next);
});

router.get('/:index/features', SubclassController.showFeaturesForSubclass);

router.get('/:index/levels/:level/features', SubclassController.showFeaturesForSubclassAndLevel);
router.get('/:index/levels/:level', SubclassController.showLevelForSubclass);
router.get('/:index/levels', SubclassController.showLevelsForSubclass);

export default router;
