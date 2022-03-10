import * as express from 'express';
const router = express.Router();
import * as MagicItemController from '../../controllers/api/magicItemController';

router.get('/', MagicItemController.index);
router.get('/:index', MagicItemController.show);

export default router;
