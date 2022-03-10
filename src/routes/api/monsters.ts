import * as express from 'express';
const router = express.Router();
import * as MonsterController from '../../controllers/api/monsterController';

router.get('/', MonsterController.index);
router.get('/:index', MonsterController.show);

export default router;
