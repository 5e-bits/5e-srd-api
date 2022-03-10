import * as express from 'express';
const router = express.Router();
import * as SpellController from '../../controllers/api/spellController';

router.get('/', function (req: any, res: any, next: any) {
    SpellController.index(req, res, next);
});

router.get('/:index', function (req: any, res: any, next: any) {
    SpellController.show(req, res, next);
});

export default router;
