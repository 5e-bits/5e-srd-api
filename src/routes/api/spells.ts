import express from 'express';
const router = express.Router();
import SpellController from '../../controllers/api/spellController';

router.get('/', SpellController.index);
router.get('/:index', SpellController.show);

export default router;
