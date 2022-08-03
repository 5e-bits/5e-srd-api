import * as SpellController from '../../controllers/api/spellController.js';
import * as express from 'express';

const router = express.Router();

router.get('/', SpellController.index);
router.get('/:index', SpellController.show);

export default router;
