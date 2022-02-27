import * as express from 'express';
const router = express.Router();
import RuleSectionController from '../../controllers/api/ruleSectionController';

router.get('/', RuleSectionController.index);
router.get('/:index', RuleSectionController.show);

export default router;
