import * as RuleController from '../../../controllers/api/2014/ruleController.js';
import * as express from 'express';

const router = express.Router();


/**
 * GET /rules
 * @tags Rules
 * @tags ResourceList
 * 
 * @summary Get all rules
 * @returns {array<APIReference>} 200 - success response
 */
router.get('/', RuleController.index);
router.get('/:index', RuleController.show);

export default router;
