import express from 'express';
const router = express.Router();
import AlignmentController from '../../controllers/api/alignmentController';

router.get('/', function(req: any, res: any, next: any) {
  AlignmentController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  AlignmentController.show(req, res, next);
});

export default router;
