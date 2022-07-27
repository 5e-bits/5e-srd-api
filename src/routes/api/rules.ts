import * as RuleController from '../../controllers/api/ruleController.js';
import * as express from 'express';

const router = express.Router();

router.get('/', RuleController.index);
router.get('/:index', RuleController.show);

export default router;
