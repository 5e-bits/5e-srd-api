import * as RuleSectionController from '../../controllers/api/ruleSectionController.js';
import * as express from 'express';

const router = express.Router();

router.get('/', RuleSectionController.index);
router.get('/:index', RuleSectionController.show);

export default router;
