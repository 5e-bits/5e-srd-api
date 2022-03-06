import express from 'express';
const router = express.Router();
import TraitController from '../../controllers/api/traitController';

router.get('/', function(req: any, res: any, next: any) {
  TraitController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  TraitController.show(req, res, next);
});

export default router;
