import * as express from 'express';
const router = express.Router();
import SkillController from '../../controllers/api/skillController';

router.get('/', function(req: any, res: any, next: any) {
  SkillController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  SkillController.show(req, res, next);
});
export default router;
