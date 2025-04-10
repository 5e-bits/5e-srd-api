import * as MagicItemController from '@/controllers/api/2014/magicItemController';
import * as express from 'express';

const router = express.Router();

router.get('/', MagicItemController.index);
router.get('/:index', MagicItemController.show);

export default router;
