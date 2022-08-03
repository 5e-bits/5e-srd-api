import AbilityScoreController from '../../controllers/api/abilityScoreController.js';
import express from 'express';

const router = express.Router();

router.get('/', function(req: any, res: any, next: any) {
  AbilityScoreController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  AbilityScoreController.show(req, res, next);
});

export default router;
