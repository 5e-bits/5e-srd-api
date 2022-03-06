import express from 'express';
const router = express.Router();
import RuleController from '../../controllers/api/ruleController';

router.get('/', RuleController.index);
router.get('/:index', RuleController.show);

export default router;
