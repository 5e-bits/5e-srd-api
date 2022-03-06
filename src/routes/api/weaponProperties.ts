import express from 'express';
const router = express.Router();
import WeaponPropertyController from '../../controllers/api/weaponPropertyController';

router.get('/', function(req: any, res: any, next: any) {
  WeaponPropertyController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  WeaponPropertyController.show(req, res, next);
});

export default router;
