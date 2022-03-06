import express from 'express';
const router = express.Router();
import MonsterController from '../../controllers/api/monsterController';

router.get('/', MonsterController.index);
router.get('/:index', MonsterController.show);

export default router;
