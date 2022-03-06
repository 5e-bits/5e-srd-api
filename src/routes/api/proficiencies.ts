import express from 'express';
const router = express.Router();
import ProficiencyController from '../../controllers/api/proficiencyController';

router.get('/', function(req: any, res: any, next: any) {
  ProficiencyController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  ProficiencyController.show(req, res, next);
});

export default router;
