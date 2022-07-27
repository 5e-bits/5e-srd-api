import * as express from 'express';

import WeaponPropertyController from '../../controllers/api/weaponPropertyController.js';

const router = express.Router();


router.get('/', function(req: any, res: any, next: any) {
  WeaponPropertyController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  WeaponPropertyController.show(req, res, next);
});

export default router;
