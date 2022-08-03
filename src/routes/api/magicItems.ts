import * as MagicItemController from '../../controllers/api/magicItemController.js';
import * as express from 'express';

const router = express.Router();

router.get('/', MagicItemController.index);
router.get('/:index', MagicItemController.show);

export default router;
